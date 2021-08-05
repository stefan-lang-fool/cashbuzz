/* eslint-disable import/prefer-default-export */
import { decode } from 'base64-arraybuffer';

export const base64ToBlob = (data: string, type?: string): Blob => new Blob([decode(data)], { type });
