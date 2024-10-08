import { DateTime } from 'luxon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { H2Title, IconCode } from 'twenty-ui';

import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { EXPIRATION_DATES } from '@/settings/developers/constants/ExpirationDates';
import { apiKeyTokenState } from '@/settings/developers/states/generatedApiKeyTokenState';
import { ApiKey } from '@/settings/developers/types/api-key/ApiKey';
import { Select } from '@/ui/input/components/Select';
import { TextInput } from '@/ui/input/components/TextInput';
import { SubMenuTopBarContainer } from '@/ui/layout/page/SubMenuTopBarContainer';
import { Section } from '@/ui/layout/section/components/Section';
import { Breadcrumb } from '@/ui/navigation/bread-crumb/components/Breadcrumb';
import { useSetRecoilState } from 'recoil';
import { Key } from 'ts-key-enum';
import { useGenerateApiKeyTokenMutation } from '~/generated/graphql';
import { isDefined } from '~/utils/isDefined';

export const SettingsDevelopersApiKeysNew = () => {
  const [generateOneApiKeyToken] = useGenerateApiKeyTokenMutation();
  const navigate = useNavigate();
  const setApiKeyToken = useSetRecoilState(apiKeyTokenState);
  const [formValues, setFormValues] = useState<{
    name: string;
    expirationDate: number | null;
  }>({
    expirationDate: EXPIRATION_DATES[5].value,
    name: '',
  });

  const { createOneRecord: createOneApiKey } = useCreateOneRecord<ApiKey>({
    objectNameSingular: CoreObjectNameSingular.ApiKey,
  });

  const handleSave = async () => {
    const expiresAt = DateTime.now()
      .plus({ days: formValues.expirationDate ?? 30 })
      .toString();

    const newApiKey = await createOneApiKey?.({
      name: formValues.name,
      expiresAt,
    });

    if (!newApiKey) {
      return;
    }

    const tokenData = await generateOneApiKeyToken({
      variables: {
        apiKeyId: newApiKey.id,
        expiresAt: expiresAt,
      },
    });
    if (isDefined(tokenData.data?.generateApiKeyToken)) {
      setApiKeyToken(tokenData.data.generateApiKeyToken.token);
      navigate(`/settings/developers/api-keys/${newApiKey.id}`);
    }
  };
  const canSave = !!formValues.name && createOneApiKey;
  return (
    <SubMenuTopBarContainer
      Icon={IconCode}
      title={
        <Breadcrumb
          links={[
            { children: 'Developers', href: '/settings/developers' },
            { children: 'New API Key' },
          ]}
        />
      }
      actionButton={
        <SaveAndCancelButtons
          isSaveDisabled={!canSave}
          onCancel={() => {
            navigate('/settings/developers');
          }}
          onSave={handleSave}
        />
      }
    >
      <SettingsPageContainer>
        <Section>
          <H2Title title="Name" description="Name of your API key" />
          <TextInput
            placeholder="E.g. backoffice integration"
            value={formValues.name}
            onKeyDown={(e) => {
              if (e.key === Key.Enter) {
                handleSave();
              }
            }}
            onChange={(value) => {
              setFormValues((prevState) => ({
                ...prevState,
                name: value,
              }));
            }}
            fullWidth
          />
        </Section>
        <Section>
          <H2Title
            title="Expiration Date"
            description="When the API key will expire."
          />
          <Select
            dropdownId="object-field-type-select"
            options={EXPIRATION_DATES}
            value={formValues.expirationDate}
            onChange={(value) => {
              setFormValues((prevState) => ({
                ...prevState,
                expirationDate: value,
              }));
            }}
          />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
