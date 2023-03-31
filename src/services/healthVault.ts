import api from '@src/axios-client';
import { isAxiosError } from 'axios';

import { handleAPIError } from 'utils/handleAPIError';

import type { DocumentPickerResponse } from 'react-native-document-picker';
import type { Tag, Document, SharedDocument, Duration, Relationship } from './types';

type GetDocumentsOptions = {
  filter: {
    field: string;
  };
  page_count: number;
  sort: {
    field: string;
    order: string;
  };
};

type GetDocumentsResponse = {
  number_of_records: number;
  page: number;
  records: Document[];
};

type GetTagsResponse = {
  Message: string;
  Tags: Tag[];
};

type SaveDocumentPayload = {
  file: DocumentPickerResponse;
  tags: Tag[];
};

type SaveDocumentResponse = {
  document_name: string;
  document_path: string;
  message: string;
};

type GetRelationsAndDurationsResponse = {
  Relationship: Relationship[];
  Message: string;
  Duration: Duration[];
};

type DeleteDocumentPayload = {
  id: number;
  name: string;
}[];

type GetSharingDocumentsResponse = {
  number_of_records: number;
  page: number;
  records: SharedDocument[];
};

type UpdateDocumentPayload = {
  document_id: number;
  health_vault_tags: Tag[];
};

type SaveSharingDocument = {
  document_list: { id: number; name: string }[];
  duration: Duration;
  recipient_email: string;
  recipient_name: string;
  relationship: Relationship;
};

export const getHVDocuments = async (options: GetDocumentsOptions) => {
  try {
    const response = await api.post<GetDocumentsResponse>('/healthvaults/get-hv-documents/', options);

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getHVTags = async () => {
  try {
    const response = await api.get<GetTagsResponse>('/healthvaults/get-health-vault-tags/');

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const saveDocument = async (data: SaveDocumentPayload) => {
  const { file, tags } = data;
  const formData = new FormData();

  if (!file.type)
    formData.append('document_file', {
      uri: file.uri,
      type: file.type || 'application/pdf',
      name: file.name || file.uri.split('/').reverse()[0],
    });
  else formData.append('document_file', file);

  formData.append('health_vault_tags', JSON.stringify(JSON.stringify(tags)));

  try {
    const response = await api.post<SaveDocumentResponse>('/healthvaults/save-hv-documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const { data, status } = error.response!;
      if (status === 400) throw new Error(data.message);
    }

    throw new Error(handleAPIError(error).message);
  }
};

export const getRelationsAndDurations = async () => {
  try {
    const response = await api.get<GetRelationsAndDurationsResponse>('/sharing/get-recipient-relationship-duration/');

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const deleteDocuments = async (data: DeleteDocumentPayload) => {
  try {
    await api.post('/healthvaults/delete-hv-documents/', {
      document_list: data,
    });
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getSharingDocuments = async (page_count: number) => {
  try {
    const response = await api.post<GetSharingDocumentsResponse>('/healthvaults/get-shared-hv-documents/', {
      page_count,
    });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const updateDocument = async (data: UpdateDocumentPayload) => {
  try {
    await api.put('/healthvaults/update-hv-documents/', data);
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const saveSharingDocument = async (data: SaveSharingDocument) => {
  try {
    await api.post('/healthvaults/save-hv-recipient-details/', data);
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};

export const getFile = async (id: number) => {
  try {
    const response = await api.post('/healthvaults/get-hv-file/', { document_id: id });

    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error).message);
  }
};
