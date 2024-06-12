import { supabase } from '../supabaseClient';

// �޴� �̸� ��ȯ ����
const menuNameMapping = {
  bruschetta: '��罺��Ÿ',
  caprese_salad: 'ī������ ������',
  caesar_salad: '���� ������',
  maragherita_pizza: '�����Ը�Ÿ ����',
  alfredo_pasta: '�������� �Ľ�Ÿ',
  bolognese_spaghetti: '���γ��� ���İ�Ƽ',
  shrimp_risotto: '���� ������',
  focaccia: '��īġ��',
  minestrone_soup: '�̳׽�Ʈ�γ� ����',
  gelato: '������',
  panna_cotta: '�ǳ� ��Ÿ',
  pesto_pasta: '�佺�� �Ľ�Ÿ',
  espresso: '����������'
};

// ���� ������ row�� ��������, 0���� ū ����� ���� ������ JSON �������� ��ȯ�ϴ� �Լ�
async function ShowReceipt() {
  try {
    // ReceiptTable���� ���� ������ row ��������
    const { data: receipts, error: receiptError } = await supabase
      .from('ReceiptTable')
      .select('*')
      .order('id', { ascending: false })
      .limit(1);

    if (receiptError) {
      console.error('Error fetching receipt data:', receiptError);
      return { error: 'An error occurred while fetching receipt data' };
    }

    if (receipts.length === 0) {
      return { error: 'No receipts found' };
    }

    const latestReceipt = receipts[0];
    const result = {};

    // MenuTable���� ��� ������ ��������
    const { data: menuData, error: menuError } = await supabase
      .from('MenuTable')
      .select('*');

    if (menuError) {
      console.error('Error fetching menu data:', menuError);
      return { error: 'An error occurred while fetching menu data' };
    }

    // 0���� ū ������ ������ �÷��� �� ���� ����� �߰�
    for (const [key, value] of Object.entries(latestReceipt)) {
      if (value > 0 && key !== 'id' && key !== 'created_at' && key !== 'total_price') {
        const menu = menuData.find(item => item.menu === key);
        if (menu) {
          const translatedName = menuNameMapping[key] || key;
          result[translatedName] = { quantity: value, price: menu.price };
        }
      }
    }

    // total_price �߰�
    result.total_price = latestReceipt.total_price;

    console.log('Latest receipt data:', result);
    return { message: 'Receipt data fetched successfully', data: result };
  } catch (error) {
    console.error('Error:', error);
    return { error: 'An error occurred during receipt data fetching' };
  }
}

export default ShowReceipt;
