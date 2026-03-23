export interface BucketDTO {
  id: string
  name: string
  color: string
  categories: string[]
}

export interface BucketsDTO {
  buckets: BucketDTO[]
}
