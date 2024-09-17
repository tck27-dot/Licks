export default interface Post {
  ID: number;
  created_by_user_id: string;
  caption: string;
  created_datetime: string;
  likes: string;
  post_id: string;
  media_file: string;
  sheet_music_file: string;
  thumbnail_file: string;
  duration: string;
  media_object_key: string;
  sheet_music_object_key: string;
  thumbnail_object_key: string;
}