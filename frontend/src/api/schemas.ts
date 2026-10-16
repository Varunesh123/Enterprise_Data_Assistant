import { useAuthStore } from '../store/authStore';
import api from './axios';

export interface DataSchema {
    id: string;
    catalog_id: string;
    name: string;
    display_name: string | null;
    description: string | null;
    environment: string;
    owner_team: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface CreateSchemaPayload {
    name: string;
    display_name?: string;
    description?: string;
    environment: string;
    owner_team?: string;
}

export async function getSchemas(
    catalogId: string,
): Promise<DataSchema[]>{
    const accessToken = useAuthStore.getState().accessToken;

    const response = await api.get<DataSchema[]>(
        `/catalogs/${catalogId}/schemas`,
        {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
        }
    )

    return response.data;
}

export async function createSchema(
    catalogId: string,
    payload: CreateSchemaPayload
): Promise<DataSchema> {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await api.post<DataSchema>(
        `/catalogs/${catalogId}/schemas`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    return response.data;
}
  