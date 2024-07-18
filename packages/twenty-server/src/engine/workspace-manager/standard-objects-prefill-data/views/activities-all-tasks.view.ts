import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  ACTIVITY_STANDARD_FIELD_IDS,
  BASE_OBJECT_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const activitiesAllTasksView = async (
  objectMetadataMap: Record<string, ObjectMetadataEntity>,
) => {
  return {
    name: 'All Tasks',
    objectMetadataId: objectMetadataMap[STANDARD_OBJECT_IDS.activity].id,
    type: 'table',
    key: null,
    position: 0,
    icon: 'IconCheck',
    kanbanFieldMetadataId: '',
    filters: [
      {
        fieldMetadataId:
          objectMetadataMap[STANDARD_OBJECT_IDS.activity].fields[
            ACTIVITY_STANDARD_FIELD_IDS.type
          ],
        displayValue: 'Task',
        operand: 'is',
        value: '["TASK"]',
      },
    ],
    fields: [
      {
        fieldMetadataId:
          objectMetadataMap[STANDARD_OBJECT_IDS.activity].fields[
            ACTIVITY_STANDARD_FIELD_IDS.title
          ],
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          objectMetadataMap[STANDARD_OBJECT_IDS.activity].fields[
            ACTIVITY_STANDARD_FIELD_IDS.type
          ],
        position: 0,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          objectMetadataMap[STANDARD_OBJECT_IDS.activity].fields[
            ACTIVITY_STANDARD_FIELD_IDS.body
          ],
        position: 0,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          objectMetadataMap[STANDARD_OBJECT_IDS.activity].fields[
            BASE_OBJECT_STANDARD_FIELD_IDS.createdAt
          ],
        position: 0,
        isVisible: true,
        size: 150,
      },
      /*
      TODO: Add later, since we don't have real-time it probably doesn't work well?
      {
        fieldMetadataId:
          objectMetadataMap[STANDARD_OBJECT_IDS.activity].fields[
            BASE_OBJECT_STANDARD_FIELD_IDS.updatedAt
          ],
        position: 0,
        isVisible: true,
        size: 210,
      },
      */
    ],
  };
};