begin;

-- Additive TEST -> LIVE content/history transfer.
-- Source records are embedded verbatim from TEST. Source numeric IDs are used
-- only inside temporary mapping tables; LIVE identity columns generate new IDs.
-- Existing LIVE lessons, items, attempts, answers, game results, topics and
-- lesson order are never updated or deleted.

create temporary table pacogo_test_live_payload (
  payload jsonb not null
) on commit drop;

insert into pg_temp.pacogo_test_live_payload(payload)
values ($paco_test_payload${"items":[{"id":460,"hint":"","answer":"lanzaam lopen. je tilt je voeten niet goed op.","question":"sjokken","lesson_id":20,"difficulty":null,"sort_order":0,"answer_parts":[{"role":"answer","text":"lanzaam lopen. je tilt je voeten niet goed op."}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["sjokken"]},{"id":461,"hint":"","answer":"hard rennen over een korte afstand","question":"sprinten","lesson_id":20,"difficulty":null,"sort_order":1,"answer_parts":[{"role":"answer","text":"hard rennen over een korte afstand"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["sprinten"]},{"id":462,"hint":"","answer":"sporten waarbij je goed je hersens moet gebruiken","question":"de denksport","lesson_id":20,"difficulty":null,"sort_order":2,"answer_parts":[{"role":"answer","text":"sporten waarbij je goed je hersens moet gebruiken"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["de denksport"]},{"id":463,"hint":"","answer":"een denksport waarbij je een dambord en damstenen gebruikt","question":"dammen","lesson_id":20,"difficulty":null,"sort_order":3,"answer_parts":[{"role":"answer","text":"een denksport waarbij je een dambord en damstenen gebruikt"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["dammen"]},{"id":464,"hint":"","answer":"een denksport waarbij je een schaakbord en schaakstukken gebruikt","question":"schaken","lesson_id":20,"difficulty":null,"sort_order":4,"answer_parts":[{"role":"answer","text":"een denksport waarbij je een schaakbord en schaakstukken gebruikt"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["schaken"]},{"id":465,"hint":"","answer":"naar de zijkant","question":"zijwaarts","lesson_id":20,"difficulty":null,"sort_order":5,"answer_parts":[{"role":"answer","text":"naar de zijkant"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["zijwaarts"]},{"id":466,"hint":"","answer":"de conditie van lichaam. iemand met een goede conditie kan bijvoorbeeld heel lang en hard rennen.","question":"de conditie","lesson_id":20,"difficulty":null,"sort_order":6,"answer_parts":[{"role":"answer","text":"de conditie van lichaam. iemand met een goede conditie kan bijvoorbeeld heel lang en hard rennen."}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["de conditie"]},{"id":467,"hint":"","answer":"uitleg hoe je te werk moet gaan,","question":"de aanwijzing","lesson_id":20,"difficulty":null,"sort_order":7,"answer_parts":[{"role":"answer","text":"uitleg hoe je te werk moet gaan,"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["de aanwijzing"]},{"id":468,"hint":"","answer":"heel erg moe","question":"bekaf","lesson_id":20,"difficulty":null,"sort_order":8,"answer_parts":[{"role":"answer","text":"heel erg moe"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["bekaf"]},{"id":469,"hint":"","answer":"toch","question":"desondanks","lesson_id":20,"difficulty":null,"sort_order":9,"answer_parts":[{"role":"answer","text":"toch"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["desondanks"]},{"id":470,"hint":"","answer":"meedoen aan iets swaarin je geen belangrijke rol speelt","question":"voor spek en bonen meedoen","lesson_id":20,"difficulty":null,"sort_order":10,"answer_parts":[{"role":"answer","text":"meedoen aan iets swaarin je geen belangrijke rol speelt"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["voor spek en bonen meedoen"]},{"id":471,"hint":"","answer":"als je ergens niet intrapt, heb je het door","question":"ergens niet intrappen","lesson_id":20,"difficulty":null,"sort_order":11,"answer_parts":[{"role":"answer","text":"als je ergens niet intrapt, heb je het door"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["ergens niet intrappen"]},{"id":317,"hint":null,"answer":"Tussen Noord-Amerika en Zuid-Amerika","question":"Waar ligt het Caribisch gebied?","lesson_id":21,"difficulty":null,"sort_order":0,"answer_parts":[{"role":"answer","text":"Tussen Noord-Amerika en Zuid-Amerika"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["Waar ligt het Caribisch gebied?"]},{"id":318,"hint":null,"answer":"De Caribische zee, de Golf van Mexico en de Atlantische oceaan","question":"Het Caribisch gebied wordt omring door? (welke zeeën?)","lesson_id":21,"difficulty":null,"sort_order":1,"answer_parts":[{"role":"answer","text":"De Caribische zee, de Golf van Mexico en de Atlantische oceaan"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["Het Caribisch gebied wordt omring door? (welke zeeën?)"]},{"id":319,"hint":null,"answer":"de Benedenwindse en de Bovenwindse eilanden","question":"Tot welke eilandengroep behoren de Kleine Antillen?","lesson_id":21,"difficulty":null,"sort_order":2,"answer_parts":[{"role":"answer","text":"de Benedenwindse en de Bovenwindse eilanden"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["Tot welke eilandengroep behoren de Kleine Antillen?"]},{"id":320,"hint":null,"answer":"1. Cuba 2. Haïti 3. Dominicaanse Republiek 4. Jamaica 5. Puero Rico 6. Kaaimaneilanden.","question":"Welke eilanden horen bij de Grote Antillen?","lesson_id":21,"difficulty":null,"sort_order":3,"answer_parts":[{"role":"answer","text":"1. Cuba 2. Haïti 3. Dominicaanse Republiek 4. Jamaica 5. Puero Rico 6. Kaaimaneilanden."}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":["Welke eilanden horen bij de Grote Antillen?"]},{"id":321,"hint":null,"answer":"2","question":"5-3=","lesson_id":22,"difficulty":null,"sort_order":0,"answer_parts":[{"role":"answer","text":"2"}],"content_data":null,"response_type":"number","answer_options":[],"question_parts":["5-3="]},{"id":322,"hint":null,"answer":"4","question":"5-1=","lesson_id":22,"difficulty":null,"sort_order":1,"answer_parts":[{"role":"answer","text":"4"}],"content_data":null,"response_type":"number","answer_options":[],"question_parts":["5-1="]},{"id":323,"hint":null,"answer":"2","question":"3-1=","lesson_id":22,"difficulty":null,"sort_order":2,"answer_parts":[{"role":"answer","text":"2"}],"content_data":null,"response_type":"number","answer_options":[],"question_parts":["3-1="]},{"id":472,"hint":"","answer":"kampioen","question":"","lesson_id":39,"difficulty":null,"sort_order":0,"answer_parts":[{"role":"answer","text":"kampioen"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":[]},{"id":473,"hint":"","answer":"Kampioen","question":"","lesson_id":40,"difficulty":null,"sort_order":0,"answer_parts":[{"role":"answer","text":"Kampioen"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":[]},{"id":474,"hint":"","answer":"piloot","question":"","lesson_id":40,"difficulty":null,"sort_order":1,"answer_parts":[{"role":"answer","text":"piloot"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":[]},{"id":475,"hint":"","answer":"sinaasappel","question":"","lesson_id":40,"difficulty":null,"sort_order":2,"answer_parts":[{"role":"answer","text":"sinaasappel"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":[]},{"id":476,"hint":"","answer":"piraat","question":"","lesson_id":40,"difficulty":null,"sort_order":3,"answer_parts":[{"role":"answer","text":"piraat"}],"content_data":null,"response_type":"text","answer_options":[],"question_parts":[]},{"id":477,"hint":"","answer":"beijing","question":"wat is de hoofdstad van china","lesson_id":41,"difficulty":null,"sort_order":0,"answer_parts":[],"content_data":null,"response_type":"text","answer_options":[],"question_parts":[]}],"topic8":{"id":8,"subvak":"Topografie","deleted":false,"student":"Zyon","subject":"Aardrijkskunde","archived":false,"created_at":"2026-10-20T11:44:22.778254+00:00"},"answers":[{"id":1,"question":"Welke eilanden horen bij de Grote Antillen?","attempt_id":1,"is_correct":false,"answered_at":"2026-09-29T16:42:51.247+00:00","given_answer":"adad","question_type":"words","question_order":1,"expected_answer":"1. Cuba 2. Haïti 3. Dominicaanse Republiek 4. Jamaica 5. Puero Rico 6. Kaaimaneilanden."},{"id":2,"question":"Waar ligt het Caribisch gebied?","attempt_id":1,"is_correct":false,"answered_at":"2026-09-29T16:42:51.247+00:00","given_answer":"asda","question_type":"words","question_order":2,"expected_answer":"Tussen Noord-Amerika en Zuid-Amerika"},{"id":3,"question":"Het Caribisch gebied wordt omring door? (welke zeeën?)","attempt_id":1,"is_correct":false,"answered_at":"2026-09-29T16:42:51.247+00:00","given_answer":"adad","question_type":"words","question_order":3,"expected_answer":"De Caribische zee, de Golf van Mexico en de Atlantische oceaan"},{"id":4,"question":"Tot welke eilandengroep behoren de Kleine Antillen?","attempt_id":1,"is_correct":false,"answered_at":"2026-09-29T16:42:51.247+00:00","given_answer":"asda","question_type":"words","question_order":4,"expected_answer":"de Benedenwindse en de Bovenwindse eilanden"},{"id":5,"question":"","attempt_id":12,"is_correct":true,"answered_at":"2026-10-25T11:28:39.937+00:00","given_answer":"kampioen","question_type":"text","question_order":1,"expected_answer":"Kampioen"},{"id":6,"question":"","attempt_id":12,"is_correct":true,"answered_at":"2026-10-25T11:28:39.937+00:00","given_answer":"piraat","question_type":"text","question_order":2,"expected_answer":"piraat"},{"id":7,"question":"","attempt_id":12,"is_correct":true,"answered_at":"2026-10-25T11:28:39.937+00:00","given_answer":"piloot","question_type":"text","question_order":3,"expected_answer":"piloot"},{"id":8,"question":"","attempt_id":12,"is_correct":true,"answered_at":"2026-10-25T11:28:39.937+00:00","given_answer":"sinaasappel","question_type":"text","question_order":4,"expected_answer":"sinaasappel"},{"id":9,"question":"","attempt_id":13,"is_correct":true,"answered_at":"2026-10-25T11:28:44.401+00:00","given_answer":"kampioen","question_type":"text","question_order":1,"expected_answer":"Kampioen"},{"id":10,"question":"","attempt_id":13,"is_correct":true,"answered_at":"2026-10-25T11:28:44.401+00:00","given_answer":"piraat","question_type":"text","question_order":2,"expected_answer":"piraat"},{"id":11,"question":"","attempt_id":13,"is_correct":true,"answered_at":"2026-10-25T11:28:44.401+00:00","given_answer":"piloot","question_type":"text","question_order":3,"expected_answer":"piloot"},{"id":12,"question":"","attempt_id":13,"is_correct":true,"answered_at":"2026-10-25T11:28:44.401+00:00","given_answer":"sinaasappel","question_type":"text","question_order":4,"expected_answer":"sinaasappel"},{"id":13,"question":"","attempt_id":14,"is_correct":true,"answered_at":"2026-10-25T11:41:12.771+00:00","given_answer":"kampioen","question_type":"text","question_order":1,"expected_answer":"Kampioen"},{"id":14,"question":"","attempt_id":14,"is_correct":true,"answered_at":"2026-10-25T11:41:12.771+00:00","given_answer":"sinaasappel","question_type":"text","question_order":2,"expected_answer":"sinaasappel"},{"id":15,"question":"","attempt_id":14,"is_correct":true,"answered_at":"2026-10-25T11:41:12.771+00:00","given_answer":"piloot","question_type":"text","question_order":3,"expected_answer":"piloot"},{"id":16,"question":"","attempt_id":14,"is_correct":true,"answered_at":"2026-10-25T11:41:12.771+00:00","given_answer":"piraat","question_type":"text","question_order":4,"expected_answer":"piraat"},{"id":17,"question":"","attempt_id":15,"is_correct":true,"answered_at":"2026-10-25T11:41:14.277+00:00","given_answer":"kampioen","question_type":"text","question_order":1,"expected_answer":"Kampioen"},{"id":18,"question":"","attempt_id":15,"is_correct":true,"answered_at":"2026-10-25T11:41:14.277+00:00","given_answer":"sinaasappel","question_type":"text","question_order":2,"expected_answer":"sinaasappel"},{"id":19,"question":"","attempt_id":15,"is_correct":true,"answered_at":"2026-10-25T11:41:14.277+00:00","given_answer":"piloot","question_type":"text","question_order":3,"expected_answer":"piloot"},{"id":20,"question":"","attempt_id":15,"is_correct":true,"answered_at":"2026-10-25T11:41:14.277+00:00","given_answer":"piraat","question_type":"text","question_order":4,"expected_answer":"piraat"},{"id":21,"question":"","attempt_id":16,"is_correct":true,"answered_at":"2026-10-25T11:57:03.854+00:00","given_answer":"piraat","question_type":"text","question_order":1,"expected_answer":"piraat"},{"id":22,"question":"","attempt_id":16,"is_correct":true,"answered_at":"2026-10-25T11:57:03.854+00:00","given_answer":"sinaasappel","question_type":"text","question_order":2,"expected_answer":"sinaasappel"},{"id":23,"question":"","attempt_id":16,"is_correct":true,"answered_at":"2026-10-25T11:57:03.854+00:00","given_answer":"kampioen","question_type":"text","question_order":3,"expected_answer":"Kampioen"},{"id":24,"question":"","attempt_id":16,"is_correct":true,"answered_at":"2026-10-25T11:57:03.854+00:00","given_answer":"piloot","question_type":"text","question_order":4,"expected_answer":"piloot"},{"id":25,"question":"","attempt_id":17,"is_correct":true,"answered_at":"2026-10-25T11:57:07.186+00:00","given_answer":"piraat","question_type":"text","question_order":1,"expected_answer":"piraat"},{"id":26,"question":"","attempt_id":17,"is_correct":true,"answered_at":"2026-10-25T11:57:07.186+00:00","given_answer":"sinaasappel","question_type":"text","question_order":2,"expected_answer":"sinaasappel"},{"id":27,"question":"","attempt_id":17,"is_correct":true,"answered_at":"2026-10-25T11:57:07.186+00:00","given_answer":"kampioen","question_type":"text","question_order":3,"expected_answer":"Kampioen"},{"id":28,"question":"","attempt_id":17,"is_correct":true,"answered_at":"2026-10-25T11:57:07.186+00:00","given_answer":"piloot","question_type":"text","question_order":4,"expected_answer":"piloot"},{"id":29,"question":"","attempt_id":18,"is_correct":true,"answered_at":"2026-10-26T00:52:48.148+00:00","given_answer":"kampioen","question_type":"text","question_order":1,"expected_answer":"kampioen"},{"id":30,"question":"","attempt_id":19,"is_correct":true,"answered_at":"2026-10-26T00:52:50.37+00:00","given_answer":"kampioen","question_type":"text","question_order":1,"expected_answer":"kampioen"},{"id":31,"question":"schaken","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"een denksport met schaakstukken en een schaakbord","question_type":"text","question_order":1,"expected_answer":"een denksport waarbij je een schaakbord en schaakstukken gebruikt"},{"id":32,"question":"voor spek en bonen meedoen","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"je doet mee maar het telt niet mee voor punten.","question_type":"text","question_order":2,"expected_answer":"meedoen aan iets swaarin je geen belangrijke rol speelt"},{"id":33,"question":"ergens niet intrappen","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"je voorziet dat iemand een grap met je uithaalt, of jou iets wil laten doen","question_type":"text","question_order":3,"expected_answer":"als je ergens niet intrapt, heb je het door"},{"id":34,"question":"de denksport","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"sport waarbij je je hersenen moet gebruiken","question_type":"text","question_order":4,"expected_answer":"sporten waarbij je goed je hersens moet gebruiken"},{"id":35,"question":"bekaf","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"ontzettend moe","question_type":"text","question_order":5,"expected_answer":"heel erg moe"},{"id":36,"question":"zijwaarts","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"via de zijkant","question_type":"text","question_order":6,"expected_answer":"naar de zijkant"},{"id":37,"question":"sprinten","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"hard rennen over een korte afstand","question_type":"text","question_order":7,"expected_answer":"hard rennen over een korte afstand"},{"id":38,"question":"dammen","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"denksport met damstenen en een dambord","question_type":"text","question_order":8,"expected_answer":"een denksport waarbij je een dambord en damstenen gebruikt"},{"id":39,"question":"sjokken","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"langzaam lopen, je tilt je voeten niet op","question_type":"text","question_order":9,"expected_answer":"lanzaam lopen. je tilt je voeten niet goed op."},{"id":40,"question":"desondanks","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"toch","question_type":"text","question_order":10,"expected_answer":"toch"},{"id":41,"question":"de aanwijzing","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"een sturende opdracht","question_type":"text","question_order":11,"expected_answer":"uitleg hoe je te werk moet gaan,"},{"id":42,"question":"de conditie","attempt_id":20,"is_correct":true,"answered_at":"2026-10-26T00:57:39.204+00:00","given_answer":"hoe goed je lichaam is voorbereid op allerlei fysieke prestaties","question_type":"text","question_order":12,"expected_answer":"de conditie van lichaam. iemand met een goede conditie kan bijvoorbeeld heel lang en hard rennen."},{"id":43,"question":"schaken","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"een denksport met schaakstukken en een schaakbord","question_type":"text","question_order":1,"expected_answer":"een denksport waarbij je een schaakbord en schaakstukken gebruikt"},{"id":44,"question":"voor spek en bonen meedoen","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"je doet mee maar het telt niet mee voor punten.","question_type":"text","question_order":2,"expected_answer":"meedoen aan iets swaarin je geen belangrijke rol speelt"},{"id":45,"question":"ergens niet intrappen","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"je voorziet dat iemand een grap met je uithaalt, of jou iets wil laten doen","question_type":"text","question_order":3,"expected_answer":"als je ergens niet intrapt, heb je het door"},{"id":46,"question":"de denksport","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"sport waarbij je je hersenen moet gebruiken","question_type":"text","question_order":4,"expected_answer":"sporten waarbij je goed je hersens moet gebruiken"},{"id":47,"question":"bekaf","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"ontzettend moe","question_type":"text","question_order":5,"expected_answer":"heel erg moe"},{"id":48,"question":"zijwaarts","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"via de zijkant","question_type":"text","question_order":6,"expected_answer":"naar de zijkant"},{"id":49,"question":"sprinten","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"hard rennen over een korte afstand","question_type":"text","question_order":7,"expected_answer":"hard rennen over een korte afstand"},{"id":50,"question":"dammen","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"denksport met damstenen en een dambord","question_type":"text","question_order":8,"expected_answer":"een denksport waarbij je een dambord en damstenen gebruikt"},{"id":51,"question":"sjokken","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"langzaam lopen, je tilt je voeten niet op","question_type":"text","question_order":9,"expected_answer":"lanzaam lopen. je tilt je voeten niet goed op."},{"id":52,"question":"desondanks","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"toch","question_type":"text","question_order":10,"expected_answer":"toch"},{"id":53,"question":"de aanwijzing","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"een sturende opdracht","question_type":"text","question_order":11,"expected_answer":"uitleg hoe je te werk moet gaan,"},{"id":54,"question":"de conditie","attempt_id":21,"is_correct":true,"answered_at":"2026-10-26T00:57:49.446+00:00","given_answer":"hoe goed je lichaam is voorbereid op allerlei fysieke prestaties","question_type":"text","question_order":12,"expected_answer":"de conditie van lichaam. iemand met een goede conditie kan bijvoorbeeld heel lang en hard rennen."}],"lessons":[{"id":20,"type":"words","title":"Thema 2: week 3","subvak":"Themawoorden","deleted":false,"student":"Zenith","subject":"Nederlands","archived":false,"created_at":"2026-09-28T20:11:20.429877+00:00","sort_order":0,"ai_check_answers":false,"learning_topic_id":5},{"id":21,"type":"words","title":"Les 2: Caribisch gebied","subvak":null,"deleted":false,"student":"Zenith","subject":"Aardrijkskunde","archived":false,"created_at":"2026-09-28T20:19:33.830267+00:00","sort_order":0,"ai_check_answers":false,"learning_topic_id":6},{"id":22,"type":"math","title":"Aftrekken tot en met 5","subvak":null,"deleted":false,"student":"Zephon","subject":"Rekenen","archived":false,"created_at":"2026-09-30T04:35:16.163567+00:00","sort_order":0,"ai_check_answers":false,"learning_topic_id":9},{"id":39,"type":"dictation","title":"Woordendictee","subvak":"Woordendictee","deleted":false,"student":"Zenith","subject":"Nederlands","archived":true,"created_at":"2026-10-18T14:48:50.088607+00:00","sort_order":0,"ai_check_answers":false,"learning_topic_id":7},{"id":40,"type":"dictation","title":"Woordendictee","subvak":"woordendictee","deleted":true,"student":"Zyon","subject":"Nederlands","archived":false,"created_at":"2026-10-18T14:57:37.976989+00:00","sort_order":0,"ai_check_answers":false,"learning_topic_id":1},{"id":41,"type":"words","title":"Azie","subvak":"Topografie","deleted":false,"student":"Zyon","subject":"Aardrijkskunde","archived":false,"created_at":"2026-10-18T20:16:54.506247+00:00","sort_order":0,"ai_check_answers":false,"learning_topic_id":8}],"attempts":[{"id":1,"score":0,"is_test":true,"student":"Zenith","lesson_id":21,"created_at":"2026-09-29T16:42:50.997998+00:00","started_at":"2026-09-29T16:42:16.909+00:00","completed_at":"2026-09-29T16:42:50.633+00:00","total_questions":4},{"id":12,"score":4,"is_test":true,"student":"Zyon","lesson_id":40,"created_at":"2026-10-25T11:28:40.012442+00:00","started_at":"2026-10-25T11:27:49.471+00:00","completed_at":"2026-10-25T11:28:39.683+00:00","total_questions":4},{"id":13,"score":4,"is_test":true,"student":"Zyon","lesson_id":40,"created_at":"2026-10-25T11:28:44.508453+00:00","started_at":"2026-10-25T11:27:49.471+00:00","completed_at":"2026-10-25T11:28:39.683+00:00","total_questions":4},{"id":14,"score":4,"is_test":true,"student":"Zyon","lesson_id":40,"created_at":"2026-10-25T11:41:12.811281+00:00","started_at":"2026-10-25T11:40:47.099+00:00","completed_at":"2026-10-25T11:41:12.546+00:00","total_questions":4},{"id":15,"score":4,"is_test":true,"student":"Zyon","lesson_id":40,"created_at":"2026-10-25T11:41:14.348062+00:00","started_at":"2026-10-25T11:40:47.099+00:00","completed_at":"2026-10-25T11:41:12.546+00:00","total_questions":4},{"id":16,"score":4,"is_test":true,"student":"Zyon","lesson_id":40,"created_at":"2026-10-25T11:57:03.653663+00:00","started_at":"2026-10-25T11:55:55.595+00:00","completed_at":"2026-10-25T11:57:03.141+00:00","total_questions":4},{"id":17,"score":4,"is_test":true,"student":"Zyon","lesson_id":40,"created_at":"2026-10-25T11:57:07.174039+00:00","started_at":"2026-10-25T11:55:55.595+00:00","completed_at":"2026-10-25T11:57:03.141+00:00","total_questions":4},{"id":18,"score":1,"is_test":true,"student":"Zenith","lesson_id":39,"created_at":"2026-10-26T00:52:48.160349+00:00","started_at":"2026-10-26T00:52:05.68+00:00","completed_at":"2026-10-26T00:52:47.746+00:00","total_questions":1},{"id":19,"score":1,"is_test":true,"student":"Zenith","lesson_id":39,"created_at":"2026-10-26T00:52:50.412347+00:00","started_at":"2026-10-26T00:52:05.68+00:00","completed_at":"2026-10-26T00:52:47.746+00:00","total_questions":1},{"id":20,"score":12,"is_test":true,"student":"Zenith","lesson_id":20,"created_at":"2026-10-26T00:57:39.123799+00:00","started_at":"2026-10-26T00:53:42.05+00:00","completed_at":"2026-10-26T00:57:38.721+00:00","total_questions":12},{"id":21,"score":12,"is_test":true,"student":"Zenith","lesson_id":20,"created_at":"2026-10-26T00:57:49.441513+00:00","started_at":"2026-10-26T00:53:42.05+00:00","completed_at":"2026-10-26T00:57:38.721+00:00","total_questions":12}],"game_results":[{"id":2,"score":2,"student":"Zenith","game_key":"flash-question","lesson_id":20,"played_at":"2026-10-18T11:57:14.27192+00:00"},{"id":3,"score":18,"student":"Zenith","game_key":"word-reveal","lesson_id":14,"played_at":"2026-10-22T23:34:01.448632+00:00"},{"id":4,"score":10240,"student":"Zephon","game_key":"double-or-nothing","lesson_id":13,"played_at":"2026-10-27T20:25:24.984684+00:00"},{"id":5,"score":1,"student":"Zenith","game_key":"flash-question","lesson_id":39,"played_at":"2026-10-29T01:59:17.963366+00:00"}],"game_access_state":[{"student":"Zenith","game_key":"memory","unlocked":false,"updated_at":"2026-10-29T19:50:33.383929+00:00"},{"student":"Zephon","game_key":"lexo","unlocked":false,"updated_at":"2026-10-30T17:44:11.381765+00:00"},{"student":"Zephon","game_key":"rock-paper-scissors","unlocked":true,"updated_at":"2026-10-30T17:44:11.381765+00:00"},{"student":"Zephon","game_key":"word-chase","unlocked":false,"updated_at":"2026-10-30T17:44:11.381765+00:00"}],"game_access_cycles":[{"cycle":3,"student":"Zenith","updated_at":"2026-10-29T19:50:32.707388+00:00"},{"cycle":5,"student":"Zephon","updated_at":"2026-10-30T17:44:11.381765+00:00"}],"game_access_settings":[{"student":"Zenith","updated_at":"2026-10-29T19:50:29.658478+00:00","minimum_score":9,"required_tests":10},{"student":"Zephon","updated_at":"2026-10-30T17:43:48.126212+00:00","minimum_score":9,"required_tests":10}]}$paco_test_payload$::jsonb);

create temporary table pacogo_topic_id_map (
  source_id bigint primary key,
  target_id bigint not null
) on commit drop;

create temporary table pacogo_lesson_id_map (
  source_id bigint primary key,
  target_id bigint not null unique
) on commit drop;

create temporary table pacogo_attempt_id_map (
  source_id bigint primary key,
  target_id bigint not null unique
) on commit drop;

do $import$
declare
  v_payload jsonb;
  v_topic record;
  v_lesson record;
  v_attempt record;
  v_game_result record;
  v_count integer;
  v_target_topic bigint;
  v_target_lesson bigint;
  v_target_attempt bigint;
  v_archived boolean;
  v_deleted boolean;
  v_inserted integer;
  v_attempt_count integer := 0;
  v_game_result_count integer := 0;
begin
  select payload into strict v_payload
  from pg_temp.pacogo_test_live_payload;

  if jsonb_array_length(v_payload -> 'lessons') <> 6 then
    raise exception 'Expected 6 TEST lesson records; transfer stopped';
  end if;
  if jsonb_array_length(v_payload -> 'items') <> 25 then
    raise exception 'Expected 25 TEST lesson items; transfer stopped';
  end if;
  if jsonb_array_length(v_payload -> 'attempts') <> 11 then
    raise exception 'Expected 11 TEST test attempts; transfer stopped';
  end if;
  if jsonb_array_length(v_payload -> 'answers') <> 54 then
    raise exception 'Expected 54 TEST answer rows; transfer stopped';
  end if;
  if jsonb_array_length(v_payload -> 'game_results') <> 4 then
    raise exception 'Expected 4 TEST game results; transfer stopped';
  end if;
  if jsonb_array_length(v_payload -> 'game_access_settings') <> 2
     or jsonb_array_length(v_payload -> 'game_access_cycles') <> 2
     or jsonb_array_length(v_payload -> 'game_access_state') <> 4 then
    raise exception 'TEST game-access state counts differ from the inspected transfer manifest';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='lesson_items'
      and column_name='content_data' and data_type='jsonb'
  ) then
    raise exception 'LIVE lesson_items.content_data is missing; apply the runtime contract migration first';
  end if;

  if exists (
    select 1 from public.game_access_settings where student in ('Zenith','Zephon')
  ) or exists (
    select 1 from public.game_access_cycles where student in ('Zenith','Zephon')
  ) or exists (
    select 1 from public.game_access_state where student in ('Zenith','Zephon')
  ) then
    raise exception 'LIVE already contains game-access rows for Zenith or Zephon; reconcile instead of overwriting';
  end if;

  if not exists (
    select 1 from public.lessons
    where id=13 and student='Zephon' and subject='Rekenen' and title='Optellen tot 10'
  ) or not exists (
    select 1 from public.lessons
    where id=14 and student='Zenith' and subject='Nederlands' and title='Thema 2: week 2'
  ) then
    raise exception 'The LIVE lesson references for TEST game results 13/14 no longer match the inspected records';
  end if;

  -- Map TEST learning-topic IDs to the corresponding LIVE topics by natural key.
  -- Existing deleted/archived topic flags are deliberately left unchanged.
  for v_topic in
    select * from (values
      (1::bigint, 'Zyon'::text, 'Nederlands'::text, 'Woordendictee'::text),
      (5::bigint, 'Zenith'::text, 'Nederlands'::text, 'Themawoorden'::text),
      (6::bigint, 'Zenith'::text, 'Aardrijkskunde'::text, ''::text),
      (7::bigint, 'Zenith'::text, 'Nederlands'::text, 'Woordendictee'::text),
      (9::bigint, 'Zephon'::text, 'Rekenen'::text, ''::text)
    ) as m(source_id, student, subject, subvak)
  loop
    select count(*), min(id)
      into v_count, v_target_topic
    from public.learning_topics
    where student=v_topic.student
      and subject=v_topic.subject
      and lower(subvak)=lower(v_topic.subvak);

    if v_count <> 1 then
      raise exception 'TEST topic % has % matching LIVE natural-key topics; stop and reconcile',
        v_topic.source_id, v_count;
    end if;

    insert into pg_temp.pacogo_topic_id_map(source_id,target_id)
    values (v_topic.source_id,v_target_topic);
  end loop;

  -- TEST topic 8 (Zyon / Aardrijkskunde / Topografie) has no LIVE counterpart.
  -- Create it as a distinct topic; never merge it into the deleted Azie topic.
  if coalesce(v_payload -> 'topic8' ->> 'student','') <> 'Zyon'
     or coalesce(v_payload -> 'topic8' ->> 'subject','') <> 'Aardrijkskunde'
     or coalesce(v_payload -> 'topic8' ->> 'subvak','') <> 'Topografie'
     or coalesce((v_payload -> 'topic8' ->> 'deleted')::boolean,true)
     or coalesce((v_payload -> 'topic8' ->> 'archived')::boolean,true) then
    raise exception 'TEST topic 8 no longer matches the approved active Topografie topic';
  end if;

  select count(*), min(id), bool_or(deleted), bool_or(archived)
    into v_count, v_target_topic, v_deleted, v_archived
  from public.learning_topics
  where student='Zyon'
    and subject='Aardrijkskunde'
    and lower(subvak)='topografie';

  if v_count = 0 then
    insert into public.learning_topics(student,subject,subvak,created_at,archived,deleted)
    values (
      'Zyon',
      'Aardrijkskunde',
      'Topografie',
      (v_payload -> 'topic8' ->> 'created_at')::timestamptz,
      false,
      false
    )
    returning id into v_target_topic;
  elsif v_count = 1 then
    if v_deleted or v_archived then
      raise exception 'A LIVE Topografie topic exists but is archived/deleted; do not restore it implicitly';
    end if;
  else
    raise exception 'Multiple LIVE Topografie topics exist; stop and reconcile';
  end if;

  insert into pg_temp.pacogo_topic_id_map(source_id,target_id) values (8,v_target_topic);

  -- Import six lessons with generated LIVE IDs. Four are hidden history snapshots.
  for v_lesson in
    select * from jsonb_to_recordset(v_payload -> 'lessons') as x(
      id bigint,
      type text,
      title text,
      subvak text,
      deleted boolean,
      student text,
      subject text,
      archived boolean,
      created_at timestamptz,
      sort_order integer,
      ai_check_answers boolean,
      learning_topic_id bigint
    )
    order by id
  loop
    if exists (
      select 1 from public.lessons l
      where l.student is not distinct from v_lesson.student
        and l.subject=v_lesson.subject
        and l.title=v_lesson.title
        and l.type=v_lesson.type
        and l.created_at=v_lesson.created_at
    ) then
      raise exception 'A matching LIVE lesson already exists for TEST lesson %; reconcile before import', v_lesson.id;
    end if;

    select target_id into v_target_topic
    from pg_temp.pacogo_topic_id_map
    where source_id=v_lesson.learning_topic_id;

    if not found then
      raise exception 'No LIVE learning-topic mapping exists for TEST lesson %', v_lesson.id;
    end if;

    v_archived := v_lesson.archived;
    v_deleted := v_lesson.deleted;
    if v_lesson.id in (20,21,39) then
      v_archived := true;
      v_deleted := false;
    elsif v_lesson.id = 40 then
      v_archived := false;
      v_deleted := true;
    end if;

    insert into public.lessons(
      subject,title,type,created_at,student,archived,subvak,
      ai_check_answers,deleted,learning_topic_id,sort_order
    ) values (
      v_lesson.subject,v_lesson.title,v_lesson.type,v_lesson.created_at,
      v_lesson.student,v_archived,v_lesson.subvak,
      v_lesson.ai_check_answers,v_deleted,v_target_topic,v_lesson.sort_order
    )
    returning id into v_target_lesson;

    insert into pg_temp.pacogo_lesson_id_map(source_id,target_id)
    values (v_lesson.id,v_target_lesson);
  end loop;

  if (select count(*) from pg_temp.pacogo_lesson_id_map) <> 6 then
    raise exception 'LIVE lesson ID mapping verification failed';
  end if;

  insert into public.lesson_items(
    lesson_id,question,answer,sort_order,question_parts,answer_parts,
    hint,response_type,answer_options,difficulty,content_data
  )
  select
    m.target_id,i.question,i.answer,i.sort_order,i.question_parts,i.answer_parts,
    i.hint,i.response_type,i.answer_options,i.difficulty,i.content_data
  from jsonb_to_recordset(v_payload -> 'items') as i(
    id bigint,
    hint text,
    answer text,
    question text,
    lesson_id bigint,
    difficulty text,
    sort_order integer,
    answer_parts jsonb,
    content_data jsonb,
    response_type text,
    answer_options jsonb,
    question_parts jsonb
  )
  join pg_temp.pacogo_lesson_id_map m on m.source_id=i.lesson_id
  order by i.lesson_id,i.sort_order,i.id;

  get diagnostics v_inserted = row_count;
  if v_inserted <> 25 then
    raise exception 'Expected 25 inserted LIVE lesson items; inserted %', v_inserted;
  end if;

  -- Copy all 11 attempts, including duplicate-looking attempts; IDs are remapped.
  for v_attempt in
    select * from jsonb_to_recordset(v_payload -> 'attempts') as x(
      id bigint,
      score integer,
      is_test boolean,
      student text,
      lesson_id bigint,
      created_at timestamptz,
      started_at timestamptz,
      completed_at timestamptz,
      total_questions integer
    )
    order by id
  loop
    select target_id into v_target_lesson
    from pg_temp.pacogo_lesson_id_map
    where source_id=v_attempt.lesson_id;

    if not found then
      raise exception 'No LIVE lesson mapping exists for TEST attempt %', v_attempt.id;
    end if;

    insert into public.test_attempts(
      lesson_id,student,score,total_questions,started_at,completed_at,is_test,created_at
    ) values (
      v_target_lesson,v_attempt.student,v_attempt.score,v_attempt.total_questions,
      v_attempt.started_at,v_attempt.completed_at,v_attempt.is_test,v_attempt.created_at
    )
    returning id into v_target_attempt;

    insert into pg_temp.pacogo_attempt_id_map(source_id,target_id)
    values (v_attempt.id,v_target_attempt);

    v_attempt_count := v_attempt_count + 1;
  end loop;

  if v_attempt_count <> 11 then
    raise exception 'Expected 11 imported attempts; imported %', v_attempt_count;
  end if;

  insert into public.test_attempt_answers(
    attempt_id,question_order,question,expected_answer,given_answer,
    is_correct,question_type,answered_at
  )
  select
    m.target_id,a.question_order,a.question,a.expected_answer,a.given_answer,
    a.is_correct,a.question_type,a.answered_at
  from jsonb_to_recordset(v_payload -> 'answers') as a(
    id bigint,
    question text,
    attempt_id bigint,
    is_correct boolean,
    answered_at timestamptz,
    given_answer text,
    question_type text,
    question_order integer,
    expected_answer text
  )
  join pg_temp.pacogo_attempt_id_map m on m.source_id=a.attempt_id
  order by a.attempt_id,a.question_order,a.id;

  get diagnostics v_inserted = row_count;
  if v_inserted <> 54 then
    raise exception 'Expected 54 inserted LIVE test answers; inserted %', v_inserted;
  end if;

  -- Keep TEST game results for unchanged LIVE lessons 13/14, and remap 20/39
  -- to their newly imported hidden historical lesson snapshots.
  for v_game_result in
    select * from jsonb_to_recordset(v_payload -> 'game_results') as x(
      id bigint,
      score integer,
      student text,
      game_key text,
      lesson_id bigint,
      played_at timestamptz
    )
    order by id
  loop
    if v_game_result.lesson_id in (20,39) then
      select target_id into v_target_lesson
      from pg_temp.pacogo_lesson_id_map
      where source_id=v_game_result.lesson_id;
      if not found then
        raise exception 'No LIVE historical lesson mapping exists for TEST game result %', v_game_result.id;
      end if;
    elsif v_game_result.lesson_id in (13,14) then
      v_target_lesson := v_game_result.lesson_id;
    else
      raise exception 'Unexpected TEST game-result lesson ID %', v_game_result.lesson_id;
    end if;

    insert into public.game_results(lesson_id,student,score,played_at,game_key)
    values (
      v_target_lesson,v_game_result.student,v_game_result.score,
      v_game_result.played_at,v_game_result.game_key
    );

    v_game_result_count := v_game_result_count + 1;
  end loop;

  if v_game_result_count <> 4 then
    raise exception 'Expected 4 imported TEST game results; imported %', v_game_result_count;
  end if;

  -- These learner-keyed game-access rows were absent in LIVE at inspection time.
  -- Stop if that baseline changed; never overwrite a LIVE learner's progress.
  insert into public.game_access_settings(student,required_tests,minimum_score,updated_at)
  select student,required_tests,minimum_score,updated_at
  from jsonb_to_recordset(v_payload -> 'game_access_settings') as x(
    student text,updated_at timestamptz,minimum_score integer,required_tests integer
  );

  get diagnostics v_inserted = row_count;
  if v_inserted <> 2 then
    raise exception 'Expected 2 inserted LIVE game-access settings; inserted %', v_inserted;
  end if;

  insert into public.game_access_cycles(student,cycle,updated_at)
  select student,cycle,updated_at
  from jsonb_to_recordset(v_payload -> 'game_access_cycles') as x(
    cycle integer,student text,updated_at timestamptz
  );

  get diagnostics v_inserted = row_count;
  if v_inserted <> 2 then
    raise exception 'Expected 2 inserted LIVE game-access cycles; inserted %', v_inserted;
  end if;

  insert into public.game_access_state(student,game_key,unlocked,updated_at)
  select student,game_key,unlocked,updated_at
  from jsonb_to_recordset(v_payload -> 'game_access_state') as x(
    student text,game_key text,unlocked boolean,updated_at timestamptz
  )
  order by student,unlocked,game_key;

  get diagnostics v_inserted = row_count;
  if v_inserted <> 4 then
    raise exception 'Expected 4 inserted LIVE game-access states; inserted %', v_inserted;
  end if;

  if (select count(*) from pg_temp.pacogo_attempt_id_map) <> 11
     or (select count(*) from pg_temp.pacogo_topic_id_map) <> 6 then
    raise exception 'TEST -> LIVE ID mapping verification failed';
  end if;
end;
$import$;

commit;
