/**
 * Renders a form for creating or editing content with the given thematic.
 *
 * @return {JSX.Element} The form component.
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, CustomInput, Label } from '../components';
import { useContent } from '../context/ContentContext';
import { useCategories } from '../context/CategoriesContext';

const ContentFromPages = () => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [permissionsCategory, setPermissionsCategory] = useState<string[]>([]);
  const { isAuthenticated, user } = useAuth();
  const { categoriesData } = useCategories();
  const {
    errors: errorsContent,
    saveContent,
    updateContent,
    getContent,
  } = useContent();
  const navigate = useNavigate();
  const params = useParams();
  const selectNameTheme = watch('name_theme');
  const [nameThemeWhenEdit, setNameThemeWhenEdit] = useState<string>('');

  const isReaders = user?.role === 'readers';

  useEffect(() => {
    if (!isAuthenticated || isReaders) {
      navigate('/login');
    }
  });

  const onSubmit = handleSubmit((data) => {
    try {
      if (params.id) {
        updateContent(params.id, {
          _id: data._id,
          name_theme: data.name_theme,
          url_image: data.url_image,
          url_video: data.url_video,
          content_text: data.content_text,
        });
      } else {
        saveContent({
          name_theme: data.name_theme,
          url_image: data.url_image,
          url_video: data.url_video,
          content_text: data.content_text,
          credits: '',
        });
      }
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  });

  const findCategory = (name: string) => {
    return categoriesData.find((category) => category.name === name);
  };

  useEffect(() => {
    const category = findCategory(selectNameTheme);
    console.log(category);

    if (!!category && category?.permissions.length > 0) {
      setPermissionsCategory(category?.permissions);
    }
  }, [watch, selectNameTheme, nameThemeWhenEdit]);

  useEffect(() => {
    const loadContent = async () => {
      if (params.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { name_theme, url_image, url_video, content_text }: any =
          await getContent(params.id);
        setNameThemeWhenEdit(name_theme[0]);
        setValue('name_theme', name_theme[0]);
        setValue('url_image', url_image);
        setValue('url_video', url_video);
        setValue('content_text', content_text);
        setValue('permissions', permissionsCategory);
      }
    };
    loadContent();
  }, []);

  if (!categoriesData) return <div>Loading...</div>;
  if (categoriesData.length === 0) {
    return (
      <h1 className="text-white text-3xl mb-5">
        No exist tematics please communicate with your administrator.
      </h1>
    );
  }
  return (
    <Card>
      {errorsContent &&
        errorsContent.length > 0 &&
        errorsContent.map((error, i) => (
          <p
            key={i}
            className="text-slate-200 bg-red-500 py-2 px-3 text-sm rounded-sm mb-1"
          >
            {error}
          </p>
        ))}
      <h1 className="text-white text-3xl mb-5">{params.id ? 'Edit' : 'Add'}</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <Label name="name_theme">Select name theme (Tematica)</Label>
          <select
            id="name_theme"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register('name_theme', { required: true })}
          >
            <option selected>Choose a option</option>
            {categoriesData?.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {errors.name_theme && (
          <p className="text-red-500">Name theme (tematica) is required</p>
        )}
        <div className="mb-6">
          {permissionsCategory.map((permission, i) => {
            if (permission === 'images')
              return (
                <CustomInput
                  key={i}
                  type="text"
                  label="Images URL"
                  name="url_image"
                  register={register}
                  registerOptions={{ required: false }}
                />
              );
            if (permission === 'videos')
              return (
                <CustomInput
                  key={i}
                  type="text"
                  label="Videos URL"
                  name="url_video"
                  register={register}
                  registerOptions={{ required: false }}
                />
              );
            return (
              <>
                <Label name="content_text">Content Text</Label>
                <textarea
                  id="content_text"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your text here..."
                  {...register('content_text', { required: false })}
                />
              </>
            );
          })}
        </div>
        <Button>{params.id ? 'Edit' : 'Add'} Content</Button>
      </form>
    </Card>
  );
};

export default ContentFromPages;

