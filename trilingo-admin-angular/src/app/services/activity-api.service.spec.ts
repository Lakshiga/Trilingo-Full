import { TestBed } from '@angular/core/testing';
import { ActivityApiService } from './activity-api.service';
import { HttpClientService } from './http-client.service';
import { of } from 'rxjs';
import { MultilingualText } from '../types/multilingual.types';

describe('ActivityApiService', () => {
  let service: ActivityApiService;
  let httpClientService: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const httpClientServiceSpy = jasmine.createSpyObj('HttpClientService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ActivityApiService,
        { provide: HttpClientService, useValue: httpClientServiceSpy }
      ]
    });

    service = TestBed.inject(ActivityApiService);
    httpClientService = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toCreateDto', () => {
    it('should correctly map multilingual titles to backend DTO with PascalCase properties', () => {
      const title: MultilingualText = {
        ta: 'தமிழ் தலைப்பு',
        en: 'English Title',
        si: 'සිංහල මාතෘකාව'
      };

      const item: any = {
        contentJson: '{}',
        lessonId: 1,
        mainActivityId: 2,
        activityTypeId: 3,
        title: title,
        sequenceOrder: 1
      };

      const result: any = (service as any).toCreateDto(item);

      expect(result.Name_en).toBe('English Title');
      expect(result.Name_ta).toBe('தமிழ் தலைப்பு');
      expect(result.Name_si).toBe('සිංහල මාතෘකාව');
      expect(result.Details_JSON).toBe('{}');
      expect(result.StageId).toBe(1);
      expect(result.MainActivityId).toBe(2);
      expect(result.ActivityTypeId).toBe(3);
      expect(result.SequenceOrder).toBe(1);
    });
  });

  describe('toUpdateDto', () => {
    it('should correctly map partial updates with multilingual titles', () => {
      const title: MultilingualText = {
        ta: 'தமிழ் தலைப்பு',
        en: 'English Title',
        si: 'සිංහල මාතෘකාව'
      };

      const item: any = {
        title: title
      };

      const result: any = (service as any).toUpdateDto(item);

      expect(result.Name_en).toBe('English Title');
      expect(result.Name_ta).toBe('தமிழ் தலைப்பு');
      expect(result.Name_si).toBe('සිංහල මාතෘකාව');
    });

    it('should handle partial title updates correctly', () => {
      const item: any = {
        title: {
          en: 'Updated English Title'
        }
      };

      const result: any = (service as any).toUpdateDto(item);

      expect(result.Name_en).toBe('Updated English Title');
      expect(result.Name_ta).toBeUndefined();
      expect(result.Name_si).toBeUndefined();
    });
  });

  describe('toFrontend', () => {
    it('should correctly map backend DTO to frontend model with multilingual titles', () => {
      const dto: any = {
        Id: 1,
        Name_en: 'English Title',
        Name_ta: 'தமிழ் தலைப்பு',
        Name_si: 'සිංහල මාතෘකාව',
        Details_JSON: '{}',
        StageId: 1,
        MainActivityId: 2,
        ActivityTypeId: 3,
        SequenceOrder: 1
      };

      const result: any = (service as any).toFrontend(dto);

      expect(result.activityId).toBe(1);
      expect(result.title.en).toBe('English Title');
      expect(result.title.ta).toBe('தமிழ் தலைப்பு');
      expect(result.title.si).toBe('සිංහල මාතෘකාව');
      expect(result.contentJson).toBe('{}');
      expect(result.lessonId).toBe(1);
      expect(result.mainActivityId).toBe(2);
      expect(result.activityTypeId).toBe(3);
      expect(result.sequenceOrder).toBe(1);
    });
    
    it('should correctly map backend DTO with lowercase properties to frontend model', () => {
      const dto: any = {
        id: 1,
        name_en: 'English Title',
        name_ta: 'தமிழ் தலைப்பு',
        name_si: 'සිංහල මාතෘකාව',
        details_JSON: '{}',
        stageId: 1,
        mainActivityId: 2,
        activityTypeId: 3,
        sequenceOrder: 1
      };

      const result: any = (service as any).toFrontend(dto);

      expect(result.activityId).toBe(1);
      expect(result.title.en).toBe('English Title');
      expect(result.title.ta).toBe('தமிழ் தலைப்பு');
      expect(result.title.si).toBe('සිංහල මාතෘකාව');
      expect(result.contentJson).toBe('{}');
      expect(result.lessonId).toBe(1);
      expect(result.mainActivityId).toBe(2);
      expect(result.activityTypeId).toBe(3);
      expect(result.sequenceOrder).toBe(1);
    });
  });
});