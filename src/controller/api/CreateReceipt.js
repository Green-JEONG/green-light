import { supabase } from '../supabaseClient';


// �ֹ� �����͸� ReceiptTable�� �߰��ϴ� �Լ�
async function CreateReceipt(order) {
  try {
    // ���ο� row ���� �غ�
    let newRow = {
      total_price: order.total
    };

    // �ֹ� �����Ϳ��� �� �޴��� ������ newRow�� �߰�
    order.items.forEach(item => {
      newRow[item.name] = item.quantity;
    });

    // ReceiptTable�� ���ο� row ���� (id�� �ڵ� �����ǵ��� �Ѵ�)
    const { data, error } = await supabase
      .from('ReceiptTable')
      .insert([newRow], { returning: 'minimal' }); // returning�� minimal�� �����Ͽ� ������ �ּ�ȭ

    if (error) {
      console.error('Error inserting receipt data:', error);
      return { error: 'An error occurred while inserting receipt data' };
    }

    console.log('Receipt created successfully:', data);
    return { message: 'Receipt created successfully', data };
  } catch (error) {
    console.error('Error:', error);
    return { error: 'An error occurred during receipt creation' };
  }
}

export default CreateReceipt;
