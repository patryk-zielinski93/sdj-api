export interface VideoMetadata {
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean,
    regionRestriction: {
      allowed: [
        string
        ],
      blocked: [
        string
        ]
    },
    projection: string;
    hasCustomThumbnail: boolean
  };
  etag: string;
  id: string;
  kind: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: any;
    channelTitle: string;
    tags: [
      string
      ],
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage: string;
    localized: {
      title: string;
      description: string
    },
    defaultAudioLanguage: string
  };
}
