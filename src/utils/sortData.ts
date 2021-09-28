export const sortData = (params: {
  itemList: any[];
  field: string;
  order: string;
}) => {
  const { itemList = [], field = '', order = 'ASC' } = params;
  const sortItems = itemList.sort((a, b) => {
    const val1 = a[field].toLowerCase();
    const val2 = b[field].toLowerCase();
    if (val1 < val2) {
      return order === 'ASC' ? -1 : 1;
    }
    if (val1 > val2) {
      return order === 'ASC' ? 1 : -1;
    }
    return 0;
  });
  return sortItems;
};
