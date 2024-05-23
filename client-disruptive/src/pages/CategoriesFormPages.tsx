/**
 * Renders a form for creating or updating a category.
 *
 * @return {JSX.Element} The rendered form component.
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, CustomInput } from '../components/';
import { useNavigate, useParams } from 'react-router-dom';
import { usePermission } from '../context/PermissionContext';
import { useCategories } from '../context/CategoriesContext';

const CategoriesFormPages = () => {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const { permissionsData } = usePermission();
  const {
    saveCategory,
    errors: errorsCategories,
    updateCategory,
    getCategory,
  } = useCategories();
  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (params.id) {
        updateCategory(params.id, {
          _id: data._id,
          name: data.name,
          cover: data.cover,
          permissions: data.permissions,
        });
      } else {
        saveCategory({
          _id: data._id,
          name: data.name,
          cover: data.cover,
          permissions: data.permissions,
        });
      }

      navigate('/categories');
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    const loadCategory = async () => {
      if (params.id) {
        const category: any = await getCategory(params.id);
        setValue('name', category.name);
        setValue('cover', category.cover);
        setValue('permissions', category.permissions);
      }
    };
    loadCategory();
  }, []);

  useEffect(() => {
    if (!params.id) {
      reset();
    }
  }, [params.id]);

  return (
    <Card>
      {errorsCategories &&
        errorsCategories.length > 0 &&
        errorsCategories.map((error, i) => (
          <p
            key={i}
            className="text-slate-200 bg-red-500 py-2 px-3 text-sm rounded-sm mb-1"
          >
            {error}
          </p>
        ))}
      <h1 className="text-white text-3xl mb-5">
        {params.id ? 'Update' : 'Create'} Category
      </h1>
      <form onSubmit={onSubmit}>
        <CustomInput
          type="text"
          label="Name"
          name="name"
          register={register}
          registerOptions={{ required: true }}
        />
        {errors.name && (
          <p className="text-red-500">name category is required</p>
        )}
        <CustomInput
          type="text"
          label="Cover image url"
          name="cover"
          register={register}
          registerOptions={{ required: true }}
        />
        {errors.cover && (
          <p className="text-red-500">cover image url is required</p>
        )}
        <div className="w-full mb-4">
          <span className="text-white">Permissions</span>
          <div className="flex gap-2">
            {permissionsData.map((permission: any, i: number) => {
              return (
                <div key={i}>
                  <input
                    type="checkbox"
                    value={permission?.name}
                    className="mr-2"
                    {...register('permissions', { required: true })}
                  />
                  {permission?.name}
                </div>
              );
            })}
          </div>
          {errors.permissions && (
            <p className="text-red-500">permissions is required</p>
          )}
        </div>
        <Button>Save</Button>
      </form>
    </Card>
  );
};

export default CategoriesFormPages;

