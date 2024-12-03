import { z } from 'zod';

const metadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export type Metadata = z.infer<typeof metadataSchema>;

export async function fetchMetadata(url: string): Promise<Metadata> {
  try {
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    return metadataSchema.parse({
      title: data.data?.title,
      description: data.data?.description,
      image: data.data?.image?.url,
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {};
  }
}