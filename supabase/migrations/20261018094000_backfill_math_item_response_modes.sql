update public.lesson_items li
set response_type = 'number'
from public.lessons l
where l.id = li.lesson_id
  and l.type = 'math'
  and li.response_type = 'text';
