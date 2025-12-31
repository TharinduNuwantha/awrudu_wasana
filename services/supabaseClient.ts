import { createClient } from '@supabase/supabase-js';
import { Wish } from '../types';

const SUPABASE_URL = 'https://unvojcignngunbsxacmu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DONDS_HErQDypfEiViaRig_iZv8MnDQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const saveWishToSupabase = async (
  senderName: string, 
  message: string, 
  templateId: number, 
  avatarId?: number, 
  imageUrl?: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .insert([
        { 
          sender_name: senderName,
          message: message,
          template_id: templateId,
          avatar_id: avatarId,
          image_url: imageUrl
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }
    return data.id;
  } catch (e) {
    console.error('Save wish exception:', e);
    return null;
  }
};

export const getWishFromSupabase = async (id: string): Promise<Wish | null> => {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }

    return {
      id: data.id,
      senderName: data.sender_name,
      message: data.message,
      image: data.image_url,
      avatarId: data.avatar_id,
      templateId: data.template_id,
      createdAt: new Date(data.created_at).getTime()
    };
  } catch (e) {
    console.error('Get wish exception:', e);
    return null;
  }
};