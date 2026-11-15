import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CodeLabService } from '../../core/services/code-lab.service';
import { CodeLabComponent } from './code-lab.component';

describe('CodeLabComponent & CodeLabService', () => {
  let httpMock: HttpTestingController;
  let codeLab: CodeLabService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeLabComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    codeLab = TestBed.inject(CodeLabService);
  });

  afterEach(() => {
    // Flush any pending profile/code requests opened during initialization
    httpMock.match(() => true).forEach((req) => {
      if (!req.cancelled) {
        req.flush([]);
      }
    });
  });

  it('should create CodeLabComponent and render header', () => {
    const fixture = TestBed.createComponent(CodeLabComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Lemon Code Lab');
  });

  it('should compute KPI metrics and filter tasks by status and tag', async () => {
    const mockRepos = [{ folderId: 'folder-1', name: 'demo-repo', path: '/tmp/demo-repo' }];
    const mockFlows = [
      {
        id: 'flow-passed',
        name: 'Passed Task',
        status: 'ACTIVE',
        folderId: 'folder-1',
        tags: [{ tag: { name: 'unit' } }],
        config: { codeTask: { id: 't1', slug: 'passed-task', status: 'PASSED', testsTotal: 3 } },
      },
      {
        id: 'flow-failed',
        name: 'Failed Task',
        status: 'PAUSED',
        folderId: 'folder-1',
        tags: [{ tag: { name: 'e2e' } }],
        config: { codeTask: { id: 't2', slug: 'failed-task', status: 'FAILED', testsTotal: 2 } },
      },
      {
        id: 'flow-stub',
        name: 'Stub Task',
        status: 'PAUSED',
        folderId: 'folder-1',
        tags: [{ tag: { name: 'unit' } }],
        config: { codeTask: { id: 't3', slug: 'stub-task', status: 'NEW', testsTotal: 0 } },
      },
    ];

    const refreshPromise = firstValueFrom(codeLab.refreshAll('profile-test'));
    for (const req of httpMock.match(() => true)) {
      if (req.request.url.includes('/code/repos')) {
        req.flush(mockRepos);
      } else if (req.request.url.includes('/flows')) {
        req.flush(mockFlows);
      } else {
        req.flush([]);
      }
    }
    await refreshPromise;

    const metrics = await firstValueFrom(codeLab.metrics$);
    expect(metrics).toEqual({
      total: 3,
      active: 1,
      passed: 1,
      failed: 1,
      stub: 1,
    });

    codeLab.setStatusFilter('PASSED');
    const passed = await firstValueFrom(codeLab.filteredTasks$);
    expect(passed.map((t) => t.flow.id)).toEqual(['flow-passed']);

    codeLab.setStatusFilter('ALL');
    codeLab.selectTag('unit');
    const unitTasks = await firstValueFrom(codeLab.filteredTasks$);
    expect(unitTasks.map((t) => t.flow.id)).toEqual(['flow-passed', 'flow-stub']);
  });
});
