export interface NotionPage {
  object: "page"
  id: string
  created_time: string
  last_edited_time: string
  created_by: {
    object: "user"
    id: string
  }
  last_edited_by: {
    object: "user"
    id: string
  }
  cover: string | null
  icon: string | null
  parent: {
    type: "data_source_id"
    data_source_id: string
    database_id: string
  }
  archived: boolean
  in_trash: boolean
  is_locked: boolean
  properties: {
    Name: NotionTitle
    description: NotionRichText
    overview: NotionRichText
    website: NotionUrl
    categories: NotionMultiSelect
    founders: NotionMultiSelect
    investors: NotionMultiSelect
    cohort: NotionSelect
    contacts: NotionMultiSelect
  }
}

export interface NotionTitle {
  id: "title"
  type: "title"
  title: {
    type: "text"
    text: {
      content: string
      link?: {
        url: string
      }
      annotations: Record<string, any>
    }
  }
}

export interface NotionRichText {
  id: string
  type: "rich_text"
  rich_text: {
    type: "text"
    text: {
      content: string
      annotations: Record<string, any>
    }
  }
}

export interface NotionUrl {
  id: "url"
  type: "url"
  url: string | null
}

export interface NotionMultiSelect {
  id: "multi_select"
  type: "multi_select"
  multi_select: {
    id: string
    name: string
    color: string
  }
}

export interface NotionSelect {
  id: "select"
  type: "select"
  select: {
    id: string
    name: string
    color: string
  }
}
