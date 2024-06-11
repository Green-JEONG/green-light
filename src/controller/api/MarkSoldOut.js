import { supabase } from './supabaseClient';

// ��� ���� ������Ʈ �Լ�
async function MarkSoldOut() {
  try {
    // InventoryTable���� ��� ������ ��������
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('InventoryTable')
      .select('*');

    if (inventoryError) {
      console.error('Error fetching inventory data:', inventoryError);
      return { error: 'An error occurred while fetching inventory data' };
    }

    // IngredientTable���� ��� ������ ��������
    const { data: ingredientData, error: ingredientError } = await supabase
      .from('IngredientTable')
      .select('*');

    if (ingredientError) {
      console.error('Error fetching ingredient data:', ingredientError);
      return { error: 'An error occurred while fetching ingredient data' };
    }

    // ��� ���¸� ������Ʈ�� ���
    const updates = [];

    // InventoryTable�� �� row�� Ȯ���Ͽ� IngredientTable�� ���� ��
    // ���� ���Ͽ� 1���� �޴��� ���� �� ���� ���� ��ᰡ ��������, �ش� ��Ḧ �����ϰ� �ִ� �޴����� ��� SoldOutó��
    ingredientData.forEach(ingredient => {
      const inventoryItem = inventoryData.find(item => item.ingredient_id === ingredient.id);
      if (inventoryItem) {
        const isSoldOut = inventoryItem.quantity < 1;
        const isNotSoldOut = inventoryItem.quantity >= 1;
        if (isSoldOut) {
          updates.push({ id: ingredient.id, sold_out: true });
        } else if (isNotSoldOut) {
          updates.push({ id: ingredient.id, sold_out: false });
        }
      }
    });

    // IngredientTable���� sold_out ���� ������Ʈ
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('IngredientTable')
        .update({ sold_out: update.sold_out })
        .eq('id', update.id);

      if (updateError) {
        console.error(`Error updating sold_out for ingredient ID ${update.id}:`, updateError);
        return { error: `An error occurred while updating sold_out for ingredient ID ${update.id}` };
      }
    }

    // IngredientTable���� ��� sold_out �� ��������
    // SoldOut�� ��� true, �ƴҰ�� false
    const { data: updatedIngredients, error: updatedIngredientsError } = await supabase
      .from('IngredientTable')
      .select('id, sold_out');

    if (updatedIngredientsError) {
      console.error('Error fetching updated ingredients:', updatedIngredientsError);
      return { error: 'An error occurred while fetching updated ingredient data' };
    }

    console.log('Sold out status updated successfully');
    return { message: 'Sold out status updated successfully', ingredients: updatedIngredients };
  } catch (error) {
    console.error('Error:', error);
    return { error: 'An error occurred during the update process' };
  }
}

// ���� ����
MarkSoldOut().then((response) => {
  console.log(response);
});

export default MarkSoldOut;
