import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getFileAbsoluteURI } from '~/utils/file/getFileAbsoluteURI';
import { isDefined } from '~/utils/isDefined';
import { useGetOneServerlessFunction } from '@/settings/serverless-functions/hooks/useGetOneServerlessFunction';

export type ServerlessFunctionFormValues = {
  name: string;
  description: string;
  code: string;
};

export type SetServerlessFunctionFormValues = Dispatch<
  SetStateAction<ServerlessFunctionFormValues>
>;

export const useServerlessFunctionFormValues = (
  serverlessFunctionId: string,
): [ServerlessFunctionFormValues, SetServerlessFunctionFormValues] => {
  const { serverlessFunction } =
    useGetOneServerlessFunction(serverlessFunctionId);
  const [formValues, setFormValues] = useState<ServerlessFunctionFormValues>({
    name: '',
    description: '',
    code: '',
  });

  useEffect(() => {
    const getFileContent = async () => {
      const resp = await fetch(
        getFileAbsoluteURI(serverlessFunction?.sourceCodeFullPath),
      );
      if (resp.status !== 200) {
        throw new Error('Network response was not ok');
      } else {
        const result = await resp.text();
        const newState = {
          code: result,
          name: serverlessFunction?.name || '',
          description: serverlessFunction?.description || '',
        };
        setFormValues((prevState) => ({
          ...prevState,
          ...newState,
        }));
      }
    };
    if (isDefined(serverlessFunction?.sourceCodeFullPath)) {
      getFileContent();
    }
  }, [serverlessFunction, setFormValues]);

  return [formValues, setFormValues];
};
