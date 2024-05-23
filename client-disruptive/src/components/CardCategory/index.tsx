import { categoryT } from '../../types/categoryT';
import ButtonLink from '../ButtonLink';
import Button from '../Button';
import { useCategories } from '../../context/CategoriesContext';
const CardCategory = ({ name, cover, permissions, _id }: categoryT) => {
  const { deleteCategory } = useCategories();
  return (
    <div className="max-w-md rounded overflow-hidden shadow-lg bg-zinc-800">
      <img
        className="w-[250px] h-[250px] object-cover"
        src={cover || 'https://via.placeholder.com/250'}
        alt={name}
      />
      <div className="px-6 py-2">
        <div className="font-bold text-xl mb-2">{name}</div>
      </div>
      <div className="px-6 pt-2 pb-2">
        <p className="text-white text-xl font-bold">Permissions:</p>
        <div className="flex gap-2">
          {permissions.map((permission: string) => (
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {permission}
            </span>
          ))}
        </div>
      </div>
      <footer className="px-6 py-2 flex gap-2 justify-between items-center">
        <ButtonLink to={`/categories/${_id}`}>Edit</ButtonLink>
        <Button onClick={() => deleteCategory(_id)} bgColor="bg-red-500">
          Delete
        </Button>
      </footer>
    </div>
  );
};

export default CardCategory;

