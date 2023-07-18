import React, { useState, ChangeEvent } from 'react';
import * as musicMetadata from 'music-metadata-browser';
import uniqid from 'uniqid';
import useUploadModal from '@/hooks/useUploadModal';
import Modal from './Modal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import Input from './Input';
import Button from './Button';

interface SongInfo {
  title: string;
  artist: string;
  album: string;
  picture: string;
}

const UploadModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      album: '',
      song: null,
      image: null
    }
  });

  const songFile = watch('song');

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setSongInfo(null);
      uploadModal.onClose();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const metadata = await musicMetadata.parseBlob(file);

        const { common } = metadata;
        const { title, artist, album } = common;
        const picture = common.picture?.[0]?.data;

        setSongInfo({ title, artist, album, picture });
        setImageFile(file);
        setValue('title', title);
        setValue('author', artist);
        setValue('album', album);
      } catch (error) {
        console.error('Error parsing song metadata:', error);
      }
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      
      const songFile = values.song?.[0];
      const imageFile = values.image?.[0];

      if (!songFile || !imageFile || !user) {
        toast.error('Missing Fields');
        return;
      }

      const uniqueID = uniqid();

      const {
        data: songData,
        error: songError
      } = await supabaseClient.storage.from('songs').upload(`song-${values.title}-${uniqueID}`, songFile, {
        cacheControl: '3600',
        upsert: false
      });

      if (songError) {
        setIsLoading(false);
        return toast.error('Failed song Upload');
      }

      const {
        data: imageData,
        error: imageError
      } = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Image Upload Failed');
      }

      const { error: supabaseError } = await supabaseClient.from('songs').insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        album: values.album,
        image_path: imageData.path,
        song_path: songData.path
      });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success('Song Added!');
      reset();
      setSongInfo(null);
      uploadModal.onClose();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a Song"
      description="Upload a .mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song Title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song Author"
        />
        <Input
          id="album"
          disabled={isLoading}
          {...register('album', { required: true })}
          placeholder="Song Album"
        />
        <div>
          <div className="pb-1">Select a Song File...</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register('song', { required: true })}
            onChange={handleFileChange}
          />
        </div>
        <div>
          <div className="pb-1">Select an Image File...</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>
        {songInfo && songInfo.picture && (
          <div>
            <img src={URL.createObjectURL(imageFile)} alt="Cover" />
            <p>Title: {songInfo.title}</p>
            <p>Artist: {songInfo.artist}</p>
            <p>Album: {songInfo.album}</p>
          </div>
        )}
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
