/* Name & Username Generator (clean UI)
   - Dropdown is visible/clickable (z-index + overflow fix in CSS)
   - Names are non-repeating until pool is exhausted (bag shuffle)
   - Username regeneration is "unique-looking"
*/

const MAX_SECTIONS = 5;

// Vercel AI Gateway config: set your token here or paste it into
// the "AI Settings" input on the page (persisted in localStorage).
const GATEWAY_CONFIG = {
  baseUrl: "https://gateway.vercel.ai/v1/chat/completions",
  model: "google/gemini-2.5-flash-lite",
  token: "",
};

function getGatewayToken(){
  if (GATEWAY_CONFIG.token) return GATEWAY_CONFIG.token;
  try {
    const saved = localStorage.getItem("vg_token");
    if (saved) return saved;
  } catch(_){}
  if (window.VERCEL_GATEWAY_TOKEN) return window.VERCEL_GATEWAY_TOKEN;
  return "";
}

const COUNTRIES = [
  "American 🇺🇸","Arabic 🇸🇦","Indian 🇮🇳","Bangladeshi 🇧🇩","Pakistani 🇵🇰","Chinese 🇨🇳","Japanese 🇯🇵","Korean 🇰🇷🇰🇵",
  "Spanish 🇪🇸","French 🇫🇷","German 🇩🇪","Russian 🇷🇺","Italian 🇮🇹","Turkish 🇹🇷"
];

const RELIGION_DATA = {
  American: {
    Christian: { maleFirst: ["James","Matthew","Joshua","Daniel","Caleb","Luke","Nathan","Andrew"], femaleFirst: ["Mary","Grace","Hannah","Abigail","Sarah","Rachel","Elizabeth","Lydia"], surnames: ["Bennett","Carter","Miller","Anderson","Brooks","Parker","Reed","Turner"] },
    Jewish: { maleFirst: ["Ari","Eli","Noah","Levi","Isaac","Jonah","Ezra","David"], femaleFirst: ["Miriam","Leah","Naomi","Talia","Esther","Ruth","Aviva","Rebecca"], surnames: ["Cohen","Levine","Rosen","Kaplan","Goldberg","Friedman","Stein","Weiss"] },
    Muslim: { maleFirst: ["Omar","Yusuf","Adam","Hamza","Zayn","Ibrahim","Bilal","Rayan"], femaleFirst: ["Aisha","Mariam","Layla","Zara","Noor","Amira","Yasmin","Hana"], surnames: ["Ali","Khan","Hassan","Rahman","Ahmed","Malik","Siddiqui","Farooq"] },
    Hindu: { maleFirst: ["Arjun","Rohan","Aarav","Vikram","Kiran","Dev","Nikhil","Sanjay"], femaleFirst: ["Priya","Anika","Maya","Diya","Asha","Kavya","Isha","Riya"], surnames: ["Patel","Sharma","Mehta","Rao","Iyer","Desai","Kapoor","Nair"] },
    Buddhist: { maleFirst: ["Tenzin","Suren","Minh","Kenji","Ananda","Dara","Sangay","Bodhi"], femaleFirst: ["Pema","Sora","Mai","Lhamo","Ananda","Mina","Yuna","Tara"], surnames: ["Dorjee","Nguyen","Kim","Tran","Sato","Lama","Phan","Cho"] },
    Secular: { maleFirst: ["Mason","Logan","Ethan","Ryan","Dylan","Wyatt","Chase","Owen"], femaleFirst: ["Avery","Harper","Mia","Chloe","Nora","Riley","Skylar","Addison"], surnames: ["Morgan","Hayes","Cooper","Bailey","Foster","Collins","Murphy","Bell"] }
  },
  Arabic: {
    Muslim: { maleFirst: ["Ahmed","Omar","Yousef","Hassan","Khalid","Tariq","Ibrahim","Zaid"], femaleFirst: ["Fatima","Aisha","Mariam","Layla","Nour","Salma","Huda","Yasmin"], surnames: ["Al-Farsi","Al-Hassan","Al-Karim","Al-Masri","Al-Najjar","Al-Salem","Al-Haddad","Al-Rashid"] },
    Christian: { maleFirst: ["George","Elias","Nabil","Fadi","Rami","Michel","Boutros","Samir"], femaleFirst: ["Mariam","Rania","Maya","Nadine","Lina","Dalia","Mona","Clara"], surnames: ["Khoury","Haddad","Mansour","Sabbagh","Nassar","Sayegh","Azar","Habib"] },
    Druze: { maleFirst: ["Firas","Walid","Samir","Adel","Nizar","Kamal","Tarek","Ziad"], femaleFirst: ["Rima","Samar","Hala","Maya","Lamia","Nour","Dina","Nada"], surnames: ["Jumblatt","Arslan","Hamadeh","Halabi","Makarem","Safa","Talhouk","Kanso"] },
    Jewish: { maleFirst: ["Eli","David","Moshe","Ariel","Yair","Noam","Amir","Daniel"], femaleFirst: ["Miriam","Leah","Tamar","Yael","Noa","Shira","Ruth","Dina"], surnames: ["Mizrahi","Cohen","Levy","Ben-David","Hakim","Azoulay","Dahan","Ohana"] },
    Yazidi: { maleFirst: ["Mirza","Khalaf","Salar","Dawud","Azad","Baran","Dilovan","Jiyan"], femaleFirst: ["Vian","Rojin","Narin","Avin","Berivan","Dilan","Shirin","Zilan"], surnames: ["Shekho","Qasim","Khalaf","Hasso","Dawud","Mamo","Eli","Barakat"] },
    Secular: { maleFirst: ["Adam","Rayan","Karim","Nadir","Sami","Zain","Laith","Ammar"], femaleFirst: ["Lina","Sara","Leen","Mila","Rana","Jana","Mira","Dina"], surnames: ["Farah","Said","Saleh","Nasser","Karam","Halim","Darwish","Bitar"] }
  },
  Indian: {
    Hindu: { maleFirst: ["Aarav","Arjun","Rohan","Vikram","Rahul","Karthik","Dev","Ishan"], femaleFirst: ["Priya","Ananya","Kavya","Isha","Meera","Riya","Diya","Aditi"], surnames: ["Sharma","Patel","Iyer","Rao","Chatterjee","Gupta","Kulkarni","Menon"] },
    Muslim: { maleFirst: ["Ayaan","Imran","Farhan","Zaid","Yusuf","Danish","Sameer","Arman"], femaleFirst: ["Ayesha","Sana","Zoya","Nida","Hina","Alia","Mariam","Sara"], surnames: ["Khan","Ansari","Shaikh","Siddiqui","Qureshi","Hussain","Mirza","Ali"] },
    Sikh: { maleFirst: ["Gurpreet","Harpreet","Jaspreet","Amrit","Manpreet","Hardeep","Navdeep","Ranveer"], femaleFirst: ["Gurleen","Harleen","Jasleen","Simran","Manmeet","Navleen","Amrita","Kiran"], surnames: ["Singh","Kaur","Gill","Sidhu","Sandhu","Dhillon","Bajwa","Brar"] },
    Christian: { maleFirst: ["John","Thomas","Joseph","Daniel","Samuel","Mathew","Andrew","Kevin"], femaleFirst: ["Mary","Anita","Grace","Maria","Rachel","Susan","Angela","Clara"], surnames: ["D'Souza","Fernandes","Pereira","Thomas","Joseph","Varghese","Rodrigues","George"] },
    Jain: { maleFirst: ["Arihant","Nirav","Harsh","Kunal","Darshan","Siddharth","Parth","Bhavik"], femaleFirst: ["Nisha","Riddhi","Jinal","Kinjal","Maitri","Dhara","Pooja","Anvi"], surnames: ["Shah","Jain","Mehta","Doshi","Sanghvi","Lodha","Kothari","Bhandari"] },
    Buddhist: { maleFirst: ["Tenzin","Anand","Rahul","Siddharth","Ashok","Nima","Sonam","Karma"], femaleFirst: ["Tara","Pema","Lhamo","Maya","Sangita","Nima","Sonam","Deki"], surnames: ["Lama","Dorjee","Bhutia","Tamang","Gurung","Barua","Thapa","Sherpa"] }
  },
  Bangladeshi: {
    Muslim: { maleFirst: ["Hasan","Rahim","Fahim","Mehedi","Sajid","Naim","Tanvir","Shakib"], femaleFirst: ["Ayesha","Lamiya","Nusrat","Sumaiya","Tasnim","Mim","Jannat","Farzana"], surnames: ["Rahman","Hossain","Ahmed","Khan","Islam","Uddin","Hasan","Chowdhury"] },
    Hindu: { maleFirst: ["Sourav","Subham","Anik","Rudra","Arindam","Bikash","Debashish","Prosenjit"], femaleFirst: ["Mou","Puja","Soma","Riya","Oindrila","Ananya","Mitali","Tithi"], surnames: ["Das","Saha","Roy","Banik","Chakraborty","Ghosh","Dutta","Pal"] },
    Buddhist: { maleFirst: ["Suman","Dipankar","Ananda","Pradip","Bimal","Tapan","Sujan","Kamal"], femaleFirst: ["Purnima","Sanjida","Anika","Mita","Shanta","Tumpa","Dipa","Rupa"], surnames: ["Barua","Chakma","Mutsuddi","Talukder","Boruah","Marma","Tanchangya","Dewan"] },
    Christian: { maleFirst: ["Rony","Michael","Joseph","Peter","Robin","Samuel","Anthony","David"], femaleFirst: ["Maria","Rita","Monica","Clara","Anita","Teresa","Elina","Christine"], surnames: ["Gomes","Rozario","D'Costa","Costa","Sarker","Mandal","Corraya","Biswas"] },
    Indigenous: { maleFirst: ["Bijoy","Ranglai","Aung","Mong","Santu","Rupen","Lalrin","Jibon"], femaleFirst: ["Rupali","Mayabi","Thanching","Aungmra","Kanchan","Jhumur","Lalita","Meni"], surnames: ["Chakma","Marma","Tripura","Mro","Garo","Bawm","Tanchangya","Santal"] }
  },
  Pakistani: {
    Muslim: { maleFirst: ["Ahmed","Bilal","Hamza","Usman","Ali","Danish","Fahad","Zain"], femaleFirst: ["Ayesha","Fatima","Hira","Sana","Zainab","Maham","Iqra","Noor"], surnames: ["Khan","Ahmed","Malik","Hussain","Qureshi","Siddiqui","Butt","Sheikh"] },
    Christian: { maleFirst: ["Samuel","Daniel","Joseph","Peter","Michael","John","Naveed","Rafique"], femaleFirst: ["Mary","Anita","Grace","Ruth","Rebecca","Sara","Nadia","Angela"], surnames: ["Masih","Gill","Daniel","Yousaf","Bashir","Francis","Paul","John"] },
    Hindu: { maleFirst: ["Rajesh","Dilip","Kishor","Sunil","Vijay","Anil","Ramesh","Mahesh"], femaleFirst: ["Pooja","Kiran","Rekha","Sunita","Asha","Meena","Priya","Anita"], surnames: ["Kumar","Lal","Malhi","Advani","Chawla","Bhatia","Hingorani","Motwani"] },
    Sikh: { maleFirst: ["Harpreet","Gurpreet","Jaspreet","Baldev","Hardeep","Manpreet","Amrit","Navdeep"], femaleFirst: ["Harleen","Gurleen","Jasleen","Simran","Kiran","Manmeet","Amrita","Navleen"], surnames: ["Singh","Kaur","Gill","Sandhu","Dhillon","Bajwa","Cheema","Sodhi"] },
    Parsi: { maleFirst: ["Rustom","Cyrus","Farhad","Darius","Noshir","Ardeshir","Behram","Jamshed"], femaleFirst: ["Roxana","Farah","Meher","Dina","Roshan","Tanya","Avan","Shirin"], surnames: ["Mistry","Contractor","Engineer","Doctor","Sethna","Dastur","Bulsara","Wadia"] },
    Kalash: { maleFirst: ["Khanan","Biram","Sheraz","Aman","Zarik","Gulzar","Mirak","Darvesh"], femaleFirst: ["Gulalai","Zarina","Shahina","Roshni","Noor","Mina","Shirin","Bibi"], surnames: ["Kalash","Bumburet","Rumbur","Acholgah","Ayun","Grom","Khan","Gul"] }
  },
  Chinese: {
    Buddhist: { maleFirst: ["Wei","Ming","Jian","Chen","Bo","Liang","Jun","Tao"], femaleFirst: ["Mei","Li","Xiu","Lan","Yan","Fang","Jing","Hua"], surnames: ["Chen","Li","Wang","Zhang","Liu","Huang","Lin","Xu"] },
    Taoist: { maleFirst: ["Yuan","Tao","Qing","Shan","Feng","Zhi","Hao","Ren"], femaleFirst: ["Qing","Ling","Xian","Yue","Meilin","Lian","Xia","Rong"], surnames: ["Zhou","Wu","Sun","Ma","Gao","He","Guo","Tang"] },
    Christian: { maleFirst: ["David","Daniel","Samuel","Joseph","Peter","Michael","Andrew","Mark"], femaleFirst: ["Grace","Anna","Sarah","Maria","Esther","Joy","Rebecca","Lydia"], surnames: ["Chen","Wong","Lee","Lam","Ho","Chiu","Tsang","Yip"] },
    Muslim: { maleFirst: ["Yusuf","Ibrahim","Musa","Hasan","Ma Jun","Ali","Sulaiman","Ismail"], femaleFirst: ["Amina","Maryam","Sara","Nura","Fatima","Hana","Lina","Zahra"], surnames: ["Ma","Hai","Sha","Ding","Na","Mu","La","Bai"] },
    Secular: { maleFirst: ["Kai","Jie","Hao","Rui","Yang","Xin","Lei","Bo"], femaleFirst: ["Yue","Xin","Ning","Jia","Min","Qian","Ting","Fei"], surnames: ["Li","Wang","Zhang","Liu","Chen","Yang","Zhao","Huang"] }
  },
  Japanese: {
    Shinto: { maleFirst: ["Haruto","Daiki","Ren","Sora","Yuto","Kaito","Riku","Itsuki"], femaleFirst: ["Sakura","Yui","Hina","Aoi","Mei","Rin","Akari","Hikari"], surnames: ["Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura"] },
    Buddhist: { maleFirst: ["Kenji","Hiroshi","Takumi","Daisuke","Ryota","Akira","Shinji","Masato"], femaleFirst: ["Keiko","Emi","Yoko","Mika","Naoko","Reina","Ayumi","Chie"], surnames: ["Kobayashi","Kato","Yoshida","Yamada","Sasaki","Yamaguchi","Matsumoto","Inoue"] },
    Christian: { maleFirst: ["Rui","Noah","Leo","Luke","Ren","Kai","Joji","Masaki"], femaleFirst: ["Maria","Anna","Sara","Rina","Erika","Mina","Hana","Lisa"], surnames: ["Mori","Hayashi","Shimizu","Abe","Ikeda","Hashimoto","Ishikawa","Fujita"] },
    Secular: { maleFirst: ["Minato","Asahi","Hinata","Yuma","Toma","Nagi","Reo","Sota"], femaleFirst: ["Koharu","Ichika","Tsumugi","Mio","Yuna","Rio","Nana","Saki"], surnames: ["Saito","Maeda","Okada","Goto","Hasegawa","Murakami","Kondo","Endo"] },
    Ainu: { maleFirst: ["Aterui","Bikuni","Kanna","Rera","Shikishima","Huci","Kamuy","Sikuru"], femaleFirst: ["Rera","Pirika","Nonno","Suma","Haruka","Mina","Ape","Mukkuri"], surnames: ["Kayano","Nibutani","Kaizawa","Sunazawa","Ukaaji","Hiraga","Chiri","Monbetsu"] }
  },
  Korean: {
    Christian: { maleFirst: ["Daniel","Joseph","David","Paul","Samuel","Minjun","Jisung","Hyunwoo"], femaleFirst: ["Grace","Esther","Hannah","Sarah","Yuna","Jisoo","Minji","Eunji"], surnames: ["Kim","Lee","Park","Choi","Jung","Kang","Yoon","Lim"] },
    Buddhist: { maleFirst: ["Minho","Joon","Seojun","Taeyang","Hyun","Donghae","Sangwoo","Jiho"], femaleFirst: ["Soyeon","Hana","Jiwoo","Seoyeon","Eunha","Nari","Mina","Yerin"], surnames: ["Kim","Lee","Park","Cho","Han","Seo","Kwon","Shin"] },
    Confucian: { maleFirst: ["Jongho","Youngsoo","Sungmin","Hyunseok","Jaewon","Byungchul","Kyungho","Sangmin"], femaleFirst: ["Hyeyoung","Sookja","Eunyoung","Junghee","Mikyung","Sunhee","Jiwon","Sujin"], surnames: ["Lee","Kim","Park","Choi","Jang","Oh","Yoo","Nam"] },
    Secular: { maleFirst: ["Do-yun","Ha-jun","Si-woo","Ji-ho","Seo-jun","Yu-chan","Ian","Leo"], femaleFirst: ["Seo-ah","Ha-eun","Ji-an","Sia","Arin","Yuna","Mia","Nari"], surnames: ["Kim","Lee","Park","Choi","Kang","Jung","Yoon","Moon"] },
    Cheondoist: { maleFirst: ["Donghak","Sihyeong","Byunghee","Inam","Sanghun","Jongmin","Hyunjae","Taemin"], femaleFirst: ["Bohye","Sumin","Yeonhwa","Jihye","Eunseo","Minah","Hyejin","Sora"], surnames: ["Son","Choe","Kim","Lee","Park","Han","Jin","Ryu"] }
  },
  Spanish: {
    Catholic: { maleFirst: ["Jose","Miguel","Antonio","Juan","Carlos","Francisco","Javier","Diego"], femaleFirst: ["Maria","Carmen","Isabel","Lucia","Ana","Sofia","Teresa","Elena"], surnames: ["Garcia","Rodriguez","Martinez","Lopez","Hernandez","Gonzalez","Perez","Sanchez"] },
    Protestant: { maleFirst: ["Daniel","Samuel","David","Elias","Mateo","Lucas","Benjamin","Pablo"], femaleFirst: ["Sara","Raquel","Noemi","Ester","Rebeca","Priscila","Lidia","Daniela"], surnames: ["Flores","Cruz","Vega","Molina","Navarro","Campos","Rojas","Ortega"] },
    Jewish: { maleFirst: ["David","Elias","Isaac","Samuel","Moises","Ariel","Noam","Daniel"], femaleFirst: ["Raquel","Lea","Miriam","Esther","Tamar","Noa","Sara","Ruth"], surnames: ["Toledano","Benarroch","Levy","Cohen","Sefardi","Abravanel","Mizrahi","Nahmias"] },
    Muslim: { maleFirst: ["Omar","Yusuf","Ibrahim","Hamza","Adam","Rayan","Bilal","Zaid"], femaleFirst: ["Amina","Salma","Yasmin","Nadia","Mariam","Noor","Hana","Leila"], surnames: ["Benali","Alami","Haddad","Amrani","Naciri","Mansouri","Fahmi","Khalil"] },
    Secular: { maleFirst: ["Hugo","Leo","Adrian","Marco","Alvaro","Nicolas","Izan","Dario"], femaleFirst: ["Paula","Claudia","Nora","Vera","Alba","Irene","Julia","Valeria"], surnames: ["Ruiz","Diaz","Moreno","Alvarez","Romero","Torres","Dominguez","Ramos"] }
  },
  French: {
    Catholic: { maleFirst: ["Jean","Pierre","Louis","Antoine","Etienne","Baptiste","Mathieu","Luc"], femaleFirst: ["Marie","Claire","Anne","Camille","Sophie","Celine","Lucie","Madeleine"], surnames: ["Martin","Bernard","Dubois","Thomas","Robert","Petit","Durand","Leroy"] },
    Protestant: { maleFirst: ["David","Daniel","Samuel","Nathan","Eliot","Matthieu","Gabriel","Paul"], femaleFirst: ["Sarah","Esther","Noemie","Rebecca","Elise","Lea","Rachel","Judith"], surnames: ["Faure","Roux","Morel","Simon","Laurent","Henry","Mercier","Garnier"] },
    Muslim: { maleFirst: ["Karim","Yanis","Mehdi","Sofiane","Rayan","Amine","Nassim","Ilyes"], femaleFirst: ["Ines","Nadia","Leila","Samira","Amel","Yasmine","Sofia","Mina"], surnames: ["Bouzid","Benali","Mansouri","Haddad","Amrani","Khelifi","Ziani","Cherif"] },
    Jewish: { maleFirst: ["Ariel","David","Eli","Noam","Isaac","Samuel","Jonas","Raphael"], femaleFirst: ["Sarah","Lea","Myriam","Esther","Talia","Judith","Ruth","Hannah"], surnames: ["Cohen","Levy","Benhamou","Azoulay","Dreyfus","Weil","Attal","Lellouche"] },
    Secular: { maleFirst: ["Leo","Hugo","Enzo","Noah","Jules","Arthur","Maxime","Theo"], femaleFirst: ["Emma","Louise","Jade","Alice","Chloe","Lina","Manon","Nina"], surnames: ["Moreau","Girard","Andre","Lefevre","Lambert","Bonnet","Francois","Rousseau"] },
    Buddhist: { maleFirst: ["Minh","Tenzin","Ananda","Dara","Bao","Suren","Karma","Nima"], femaleFirst: ["Mai","Linh","Pema","Tara","Sokha","Lhamo","Nari","Yuna"], surnames: ["Nguyen","Tran","Lama","Dorje","Pham","Le","Hoang","Vann"] }
  },
  German: {
    Catholic: { maleFirst: ["Johannes","Matthias","Lukas","Thomas","Andreas","Markus","Sebastian","Florian"], femaleFirst: ["Maria","Anna","Katharina","Elisabeth","Theresa","Julia","Clara","Magdalena"], surnames: ["Schneider","Fischer","Weber","Wagner","Becker","Hoffmann","Schulz","Koch"] },
    Protestant: { maleFirst: ["Martin","Paul","Daniel","Jonas","Samuel","David","Philipp","Jakob"], femaleFirst: ["Hannah","Lea","Sarah","Miriam","Rebecca","Judith","Lena","Nora"], surnames: ["Muller","Schmidt","Meyer","Bauer","Richter","Klein","Wolf","Neumann"] },
    Jewish: { maleFirst: ["Elias","David","Noah","Levi","Isaac","Ariel","Jonas","Raphael"], femaleFirst: ["Miriam","Lea","Sarah","Esther","Talia","Ruth","Hannah","Naomi"], surnames: ["Rosenberg","Goldstein","Weiss","Klein","Levy","Cohn","Adler","Stern"] },
    Muslim: { maleFirst: ["Emir","Yusuf","Omar","Ali","Hamza","Ibrahim","Kerem","Murat"], femaleFirst: ["Aylin","Leyla","Elif","Meryem","Zeynep","Amira","Sara","Nora"], surnames: ["Yilmaz","Demir","Kaya","Sahin","Celik","Aydin","Khan","Hassan"] },
    Secular: { maleFirst: ["Finn","Ben","Leon","Noah","Felix","Moritz","Liam","Theo"], femaleFirst: ["Emma","Mia","Lina","Leni","Emilia","Ella","Marie","Sofia"], surnames: ["Kruger","Hartmann","Lange","Werner","Schmitt","Krause","Meier","Lehmann"] }
  },
  Russian: {
    Orthodox: { maleFirst: ["Ivan","Dmitry","Alexei","Mikhail","Sergei","Nikolai","Pavel","Andrei"], femaleFirst: ["Anastasia","Maria","Elena","Natalia","Olga","Tatiana","Irina","Svetlana"], surnames: ["Ivanov","Petrov","Sokolov","Mikhailov","Fedorov","Morozov","Volkov","Pavlov"] },
    Muslim: { maleFirst: ["Timur","Ruslan","Ilyas","Amir","Murad","Ramil","Marat","Azat"], femaleFirst: ["Amina","Zarina","Lilia","Samira","Alina","Guzel","Aisha","Mila"], surnames: ["Akhmetov","Karimov","Yusupov","Galiyev","Saidov","Kadyrov","Magomedov","Sabitov"] },
    Jewish: { maleFirst: ["Lev","David","Ilya","Boris","Mikhail","Yakov","Semion","Abram"], femaleFirst: ["Mira","Rivka","Leah","Esther","Anna","Dina","Raisa","Miriam"], surnames: ["Kagan","Levin","Rabinovich","Gurevich","Katz","Shapiro","Friedman","Rosenberg"] },
    Buddhist: { maleFirst: ["Bair","Dashi","Sayan","Bato","Tenzin","Aldar","Erdem","Nima"], femaleFirst: ["Darima","Sarana","Ayuna","Nima","Tara","Bayarma","Sayan","Lhamo"], surnames: ["Dorzhiyev","Budaev","Tsyrenov","Sodnomov","Bazarov","Gomboev","Lamaev","Ochirov"] },
    Secular: { maleFirst: ["Maxim","Artem","Kirill","Nikita","Roman","Vadim","Denis","Yuri"], femaleFirst: ["Alisa","Polina","Daria","Kira","Vera","Yulia","Sofia","Nina"], surnames: ["Smirnov","Kuznetsov","Popov","Lebedev","Kozlov","Novikov","Orlov","Belov"] }
  },
  Italian: {
    Catholic: { maleFirst: ["Giovanni","Marco","Luca","Matteo","Francesco","Antonio","Paolo","Giuseppe"], femaleFirst: ["Maria","Giulia","Sofia","Chiara","Francesca","Lucia","Elena","Teresa"], surnames: ["Rossi","Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci"] },
    Protestant: { maleFirst: ["Davide","Daniele","Samuele","Gabriele","Elia","Noe","Luca","Matteo"], femaleFirst: ["Sara","Rebecca","Noemi","Ester","Lidia","Debora","Rachele","Miriam"], surnames: ["Costa","Greco","Conti","Rizzo","Moretti","Barbieri","Fontana","Mariani"] },
    Jewish: { maleFirst: ["Emanuele","Davide","Elia","Isacco","Leone","Samuele","Abramo","Raffaele"], femaleFirst: ["Miriam","Lea","Sara","Ester","Rachele","Dina","Noemi","Ruth"], surnames: ["Levi","Segre","Piperno","Luzzatto","Modigliani","Sonnino","Treves","Coen"] },
    Muslim: { maleFirst: ["Omar","Yusuf","Amir","Hamza","Ibrahim","Rayan","Karim","Bilal"], femaleFirst: ["Amina","Mariam","Leila","Yasmin","Sara","Noor","Hana","Zahra"], surnames: ["Hassan","Khalil","Farah","Mansour","Benali","Amrani","Ali","Rahman"] },
    Secular: { maleFirst: ["Leonardo","Alessandro","Tommaso","Edoardo","Lorenzo","Nicolo","Andrea","Diego"], femaleFirst: ["Aurora","Ginevra","Alice","Beatrice","Vittoria","Emma","Greta","Viola"], surnames: ["Marino","Bruno","Gallo","Mancini","Lombardi","Serra","Ferrara","Martini"] }
  },
  Turkish: {
    Muslim: { maleFirst: ["Mehmet","Ahmet","Mustafa","Yusuf","Emir","Omer","Hamza","Ali"], femaleFirst: ["Fatma","Ayse","Zeynep","Elif","Meryem","Esra","Rabia","Hatice"], surnames: ["Yilmaz","Kaya","Demir","Sahin","Celik","Yildiz","Aydin","Ozturk"] },
    Alevi: { maleFirst: ["Ali","Huseyin","Hasan","Pir","Veli","Dogan","Musa","Cem"], femaleFirst: ["Zehra","Dilan","Gul","Sultan","Elif","Canan","Nesrin","Aylin"], surnames: ["Aslan","Dogan","Kilic","Polat","Kurt","Avci","Acar","Eren"] },
    Christian: { maleFirst: ["Aram","Krikor","Levon","Sarkis","Nikos","Yorgo","Murat","Bedros"], femaleFirst: ["Mariam","Ani","Talin","Sona","Eleni","Marta","Lara","Lusine"], surnames: ["Demirciyan","Sarkisyan","Papazoglu","Yorganci","Arslan","Kalayci","Topal","Avedis"] },
    Jewish: { maleFirst: ["David","Eli","Moiz","Yosef","Avram","Ariel","Daniel","Leon"], femaleFirst: ["Sara","Lea","Miriam","Esther","Dina","Rakel","Tamar","Noa"], surnames: ["Levi","Cohen","Benbasat","Alhadeff","Sevi","Mizrahi","Nasi","Aseo"] },
    Secular: { maleFirst: ["Eren","Deniz","Can","Baris","Kerem","Mert","Arda","Berk"], femaleFirst: ["Defne","Melis","Selin","Ece","Ceren","Irem","Derin","Bade"], surnames: ["Koc","Arslan","Kurt","Ozdemir","Simsek","Erdogan","Tas","Guler"] }
  }
};

const FULL_NAME_POOL_CACHE = new Map();

const ADDRESS_DATA = {
  American: { country: "United States", regionLabel: "State", postalLabel: "ZIP Code", suffixes: ["Street","Avenue","Road","Drive","Lane","Boulevard"], streets: ["Maple","Oak","Cedar","Washington","Lincoln","Hillcrest","Sunset","Lakeview"], regions: [
    { region: "California", cities: ["Los Angeles","San Diego","San Jose","Sacramento"], prefix: "90" },
    { region: "New York", cities: ["New York","Buffalo","Albany","Rochester"], prefix: "10" },
    { region: "Texas", cities: ["Houston","Dallas","Austin","San Antonio"], prefix: "75" },
    { region: "Florida", cities: ["Miami","Orlando","Tampa","Jacksonville"], prefix: "33" }
  ]},
  Arabic: { country: "Saudi Arabia", regionLabel: "Province", postalLabel: "Postal Code", suffixes: ["Street","Road","District","Avenue"], streets: ["King Fahd","Olaya","Prince Sultan","Al Noor","Al Andalus","Makkah","Al Rawdah","Corniche"], regions: [
    { region: "Riyadh Province", cities: ["Riyadh","Al Kharj","Diriyah"], prefix: "12" },
    { region: "Makkah Province", cities: ["Jeddah","Makkah","Taif"], prefix: "21" },
    { region: "Eastern Province", cities: ["Dammam","Khobar","Dhahran"], prefix: "34" },
    { region: "Madinah Province", cities: ["Madinah","Yanbu","Al Ula"], prefix: "42" }
  ]},
  Indian: { country: "India", regionLabel: "State", postalLabel: "PIN Code", suffixes: ["Road","Marg","Nagar","Street","Lane","Colony"], streets: ["MG","Nehru","Park","Station","Lake","Gandhi","Ashoka","Temple"], regions: [
    { region: "Maharashtra", cities: ["Mumbai","Pune","Nagpur","Nashik"], prefix: "40" },
    { region: "Delhi", cities: ["New Delhi","Dwarka","Rohini","Saket"], prefix: "11" },
    { region: "Karnataka", cities: ["Bengaluru","Mysuru","Mangaluru","Hubballi"], prefix: "56" },
    { region: "West Bengal", cities: ["Kolkata","Howrah","Siliguri","Durgapur"], prefix: "70" }
  ]},
  Bangladeshi: { country: "Bangladesh", regionLabel: "Division", postalLabel: "Postal Code", suffixes: ["Road","Lane","Sarani","Avenue","Para","Bazar Road"], streets: ["Dhanmondi","Banani","Station","College","Lake","Shapla","Green","Nawab"], regions: [
    { region: "Dhaka", cities: ["Dhaka","Gazipur","Narayanganj","Savar"], prefix: "12" },
    { region: "Chattogram", cities: ["Chattogram","Cox's Bazar","Cumilla","Feni"], prefix: "40" },
    { region: "Sylhet", cities: ["Sylhet","Moulvibazar","Habiganj","Sunamganj"], prefix: "31" },
    { region: "Rajshahi", cities: ["Rajshahi","Bogura","Pabna","Natore"], prefix: "60" }
  ]},
  Pakistani: { country: "Pakistan", regionLabel: "Province", postalLabel: "Postal Code", suffixes: ["Road","Street","Avenue","Colony","Block","Lane"], streets: ["Jinnah","Iqbal","Mall","Canal","Garden","Model Town","Clifton","University"], regions: [
    { region: "Punjab", cities: ["Lahore","Rawalpindi","Faisalabad","Multan"], prefix: "54" },
    { region: "Sindh", cities: ["Karachi","Hyderabad","Sukkur","Larkana"], prefix: "75" },
    { region: "Khyber Pakhtunkhwa", cities: ["Peshawar","Mardan","Abbottabad","Swat"], prefix: "25" },
    { region: "Balochistan", cities: ["Quetta","Gwadar","Turbat","Khuzdar"], prefix: "87" }
  ]},
  Chinese: { country: "China", regionLabel: "Province", postalLabel: "Postal Code", suffixes: ["Road","Street","Avenue","Lane"], streets: ["Renmin","Zhongshan","Jiefang","Heping","Dongfang","Xinhua","Huashan","Nanjing"], regions: [
    { region: "Beijing", cities: ["Beijing","Chaoyang","Haidian","Fengtai"], prefix: "100" },
    { region: "Shanghai", cities: ["Shanghai","Pudong","Minhang","Xuhui"], prefix: "200" },
    { region: "Guangdong", cities: ["Guangzhou","Shenzhen","Foshan","Dongguan"], prefix: "510" },
    { region: "Zhejiang", cities: ["Hangzhou","Ningbo","Wenzhou","Shaoxing"], prefix: "310" }
  ]},
  Japanese: { country: "Japan", regionLabel: "Prefecture", postalLabel: "Postal Code", suffixes: ["chome","dori","machi","street"], streets: ["Sakura","Aoba","Nakamachi","Honcho","Minami","Kita","Shinjuku","Ginza"], regions: [
    { region: "Tokyo", cities: ["Shinjuku","Setagaya","Shibuya","Taito"], prefix: "160" },
    { region: "Osaka", cities: ["Osaka","Sakai","Toyonaka","Higashiosaka"], prefix: "530" },
    { region: "Kyoto", cities: ["Kyoto","Uji","Kameoka","Maizuru"], prefix: "600" },
    { region: "Hokkaido", cities: ["Sapporo","Hakodate","Asahikawa","Otaru"], prefix: "060" }
  ]},
  Korean: { country: "South Korea", regionLabel: "Province", postalLabel: "Postal Code", suffixes: ["ro","gil","daero","street"], streets: ["Sejong","Teheran","Jongno","Gangnam","Mapo","Haeundae","Nambu","Central"], regions: [
    { region: "Seoul", cities: ["Gangnam-gu","Jongno-gu","Mapo-gu","Songpa-gu"], prefix: "06" },
    { region: "Busan", cities: ["Haeundae-gu","Suyeong-gu","Dongnae-gu","Sasang-gu"], prefix: "48" },
    { region: "Gyeonggi-do", cities: ["Suwon","Seongnam","Goyang","Yongin"], prefix: "16" },
    { region: "Incheon", cities: ["Bupyeong-gu","Namdong-gu","Yeonsu-gu","Jung-gu"], prefix: "21" }
  ]},
  Spanish: { country: "Spain", regionLabel: "Province", postalLabel: "Postal Code", suffixes: ["Calle","Avenida","Paseo","Plaza"], streets: ["Mayor","Real","Gran Via","Sol","Alameda","Castilla","Rosario","Libertad"], regions: [
    { region: "Madrid", cities: ["Madrid","Alcala de Henares","Getafe","Leganes"], prefix: "28" },
    { region: "Barcelona", cities: ["Barcelona","Badalona","Sabadell","Terrassa"], prefix: "08" },
    { region: "Valencia", cities: ["Valencia","Alicante","Castellon","Elche"], prefix: "46" },
    { region: "Seville", cities: ["Seville","Dos Hermanas","Utrera","Ecija"], prefix: "41" }
  ]},
  French: { country: "France", regionLabel: "Region", postalLabel: "Postal Code", suffixes: ["Rue","Avenue","Boulevard","Impasse"], streets: ["Victor Hugo","Jean Jaures","de la Paix","Pasteur","Voltaire","Carnot","Republique","Gare"], regions: [
    { region: "Ile-de-France", cities: ["Paris","Versailles","Saint-Denis","Nanterre"], prefix: "75" },
    { region: "Provence-Alpes-Cote d'Azur", cities: ["Marseille","Nice","Toulon","Avignon"], prefix: "13" },
    { region: "Auvergne-Rhone-Alpes", cities: ["Lyon","Grenoble","Saint-Etienne","Annecy"], prefix: "69" },
    { region: "Nouvelle-Aquitaine", cities: ["Bordeaux","Limoges","Poitiers","Pau"], prefix: "33" }
  ]},
  German: { country: "Germany", regionLabel: "State", postalLabel: "Postal Code", suffixes: ["Strasse","Weg","Allee","Platz"], streets: ["Haupt","Bahnhof","Garten","Schiller","Goethe","Kirch","Berg","Linden"], regions: [
    { region: "Bavaria", cities: ["Munich","Nuremberg","Augsburg","Regensburg"], prefix: "80" },
    { region: "Berlin", cities: ["Berlin","Mitte","Pankow","Spandau"], prefix: "10" },
    { region: "North Rhine-Westphalia", cities: ["Cologne","Dusseldorf","Dortmund","Essen"], prefix: "50" },
    { region: "Hesse", cities: ["Frankfurt","Wiesbaden","Kassel","Darmstadt"], prefix: "60" }
  ]},
  Russian: { country: "Russia", regionLabel: "Region", postalLabel: "Postal Code", suffixes: ["Street","Prospekt","Lane","Ulitsa"], streets: ["Lenina","Mira","Sovetskaya","Gagarina","Pushkina","Centralnaya","Sadovaya","Kirova"], regions: [
    { region: "Moscow", cities: ["Moscow","Zelenograd","Troitsk","Khimki"], prefix: "101" },
    { region: "Saint Petersburg", cities: ["Saint Petersburg","Pushkin","Kolpino","Peterhof"], prefix: "190" },
    { region: "Tatarstan", cities: ["Kazan","Naberezhnye Chelny","Almetyevsk","Nizhnekamsk"], prefix: "420" },
    { region: "Sverdlovsk Oblast", cities: ["Yekaterinburg","Nizhny Tagil","Kamensk-Uralsky","Pervouralsk"], prefix: "620" }
  ]},
  Italian: { country: "Italy", regionLabel: "Region", postalLabel: "CAP", suffixes: ["Via","Viale","Corso","Piazza"], streets: ["Roma","Garibaldi","Dante","Cavour","Verdi","Manzoni","Mazzini","Vittorio Veneto"], regions: [
    { region: "Lazio", cities: ["Rome","Latina","Viterbo","Frosinone"], prefix: "00" },
    { region: "Lombardy", cities: ["Milan","Bergamo","Brescia","Como"], prefix: "20" },
    { region: "Tuscany", cities: ["Florence","Pisa","Siena","Lucca"], prefix: "50" },
    { region: "Campania", cities: ["Naples","Salerno","Caserta","Avellino"], prefix: "80" }
  ]},
  Turkish: { country: "Turkey", regionLabel: "Province", postalLabel: "Postal Code", suffixes: ["Caddesi","Sokak","Mahallesi","Bulvari"], streets: ["Ataturk","Cumhuriyet","Istiklal","Fatih","Inonu","Gazi","Mimar Sinan","Sevgi"], regions: [
    { region: "Istanbul", cities: ["Istanbul","Kadikoy","Besiktas","Uskudar"], prefix: "34" },
    { region: "Ankara", cities: ["Ankara","Cankaya","Kecioren","Mamak"], prefix: "06" },
    { region: "Izmir", cities: ["Izmir","Konak","Bornova","Karsiyaka"], prefix: "35" },
    { region: "Antalya", cities: ["Antalya","Alanya","Manavgat","Kemer"], prefix: "07" }
  ]}
};

function getCountryKey(country){
  return String(country).split(" ")[0];
}

// Names data is loaded on-demand per country to keep initial JS small.
// JSON files live in /data/<Country>.json  (e.g., /data/American.json)
const NAMES_CACHE = new Map(); // country -> {male:[], female:[]}

async function loadCountryNames(country){
  const key = getCountryKey(country);
  if (NAMES_CACHE.has(key)) return NAMES_CACHE.get(key);
  const res = await fetch(`data/${key}.json`, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load names for ${country}: ${res.status}`);
  const obj = await res.json();
  NAMES_CACHE.set(key, obj);
  return obj;
}

// ---------- Name pools ----------

// Global name "bags" so a shown name won't appear again until the pool is exhausted.
const nameBags = new Map(); // key => array (shuffled remaining)

function randInt(maxExclusive){
  if (maxExclusive <= 0) return 0;
  if (window.crypto && crypto.getRandomValues){
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFromBag(key, pool){
  if (!pool || !pool.length) return "—";
  let bag = nameBags.get(key);
  if (!bag || bag.length === 0){
    bag = shuffle(pool);
    nameBags.set(key, bag);
  }
  return bag.pop();
}

function pickRandomCountry(){ return COUNTRIES[randInt(COUNTRIES.length)]; }
function pickRandomGender(){ return randInt(2) === 0 ? "male" : "female"; }

function getReligionData(country){
  return RELIGION_DATA[getCountryKey(country)] || null;
}

function getReligionOptions(countryValue){
  if (!countryValue || countryValue === "random") return [];
  const data = getReligionData(countryValue);
  return data ? Object.keys(data) : [];
}

function pickRandomReligion(country){
  const options = Object.keys(getReligionData(country) || {});
  return options.length ? options[randInt(options.length)] : "any";
}

function buildFullNamePool(country, religion, gender){
  const countryKey = getCountryKey(country);
  const cacheKey = `${countryKey}|${religion}|${gender}`;
  if (FULL_NAME_POOL_CACHE.has(cacheKey)) return FULL_NAME_POOL_CACHE.get(cacheKey);

  const religionData = getReligionData(country)?.[religion];
  const firstNames = religionData?.[`${gender}First`] || [];
  const surnames = religionData?.surnames || [];
  const names = [];

  for (const first of firstNames){
    for (const surname of surnames){
      names.push(`${first} ${surname}`);
    }
  }

  FULL_NAME_POOL_CACHE.set(cacheKey, names);
  return names;
}

function pickOne(items){
  return items[randInt(items.length)];
}

function cleanCustomValue(value){
  return String(value || "").trim().replace(/\s+/g, " ");
}

function makePostalCode(countryKey, region){
  const prefix = String(region?.prefix || "10");
  const digitCount = countryKey === "Japanese" ? 7 : (countryKey === "Bangladeshi" ? 4 : (countryKey === "Indian" || countryKey === "Chinese" || countryKey === "Russian" ? 6 : 5));
  const needed = Math.max(0, digitCount - prefix.length);
  const raw = `${prefix}${randomDigits(needed)}`.slice(0, digitCount);
  return countryKey === "Japanese" ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw;
}

function formatStreet(countryKey, data){
  const number = randInt(990) + 10;
  const street = pickOne(data.streets);
  const suffix = pickOne(data.suffixes);

  if (["Spanish","French","Italian"].includes(countryKey)) return `${suffix} ${street} ${number}`;
  if (countryKey === "Japanese") return `${number}-${randInt(20) + 1} ${street} ${suffix}`;
  if (countryKey === "Korean") return `${number} ${street}-${randInt(90) + 1} ${suffix}`;
  if (countryKey === "Turkish") return `${street} ${suffix} No: ${number}`;
  return `${number} ${street} ${suffix}`;
}

async function generateAddress({ country, customState, customCity, customZip }){
  const countryKey = getCountryKey(country);
  const token = getGatewayToken();

  if (token){
    const aiResult = await generateAddressWithAI({ country, customState, customCity, customZip, countryKey });
    if (aiResult) return aiResult;
  }

  const data = ADDRESS_DATA[countryKey] || ADDRESS_DATA.American;
  const region = pickOne(data.regions);
  const regionName = cleanCustomValue(customState) || region.region;
  const city = cleanCustomValue(customCity) || pickOne(region.cities);
  const postalCode = cleanCustomValue(customZip) || makePostalCode(countryKey, region);
  const street = formatStreet(countryKey, data);

  return {
    street, city, region: regionName, postalCode,
    country: data.country, regionLabel: data.regionLabel, postalLabel: data.postalLabel,
    text: `${street}\n${city}, ${regionName} ${postalCode}\n${data.country}`
  };
}

async function callAIGateway(messages){
  const token = getGatewayToken();
  if (!token) return null;
  try{
    const res = await fetch(GATEWAY_CONFIG.baseUrl, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: GATEWAY_CONFIG.model,
        messages,
        temperature: 0.3,
        max_tokens: 512,
        response_format: { type: "json_object" }
      })
    });
    if (!res.ok) return null;
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content);
  }catch(_){ return null; }
}

async function generateAddressWithAI({ country, customState, customCity, customZip, countryKey }){
  const countryName = ADDRESS_DATA[countryKey]?.country || countryKey;
  const prompt = [
    { role: "system", content: "You are a realistic address generator. Respond only with valid JSON: {\"street\":\"...\",\"city\":\"...\",\"region\":\"...\",\"postalCode\":\"...\",\"country\":\"...\"}" },
    { role: "user", content: [
      `Country: ${countryName}`,
      customState ? `State/Province: ${customState}` : "",
      customCity ? `City: ${customCity}` : "",
      customZip ? `ZIP/Postal Code: ${customZip}` : "",
      "Generate a realistic street address, city, region, and postal code matching this country's format. If a field is provided above, use it exactly."
    ].filter(Boolean).join("\n") }
  ];
  const result = await callAIGateway(prompt);
  if (!result) return null;
  return {
    street: result.street || "—",
    city: result.city || "—",
    region: result.region || "—",
    postalCode: result.postalCode || "—",
    country: result.country || countryName,
    regionLabel: "",
    postalLabel: "",
    text: `${result.street || "—"}\n${result.city || "—"}, ${result.region || "—"} ${result.postalCode || "—"}\n${result.country || countryName}`
  };
}

// ---------- Username generation ----------
function normalizeForUsername(str){
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function randomDigits(len){
  let out = "";
  for (let i=0;i<len;i++) out += String(randInt(10));
  return out;
}
function randomLetters(len){
  const abc = "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i=0;i<len;i++) out += abc[randInt(abc.length)];
  return out;
}

function generateUsernameFromName(name, usedSet){
  const year = new Date().getFullYear();
  const clean = normalizeForUsername(name);
  const parts = clean.split(" ").filter(Boolean);
  const first = parts[0] || "user";
  const last = parts[parts.length - 1] || first;

  const templates = [
    () => `${first}${last}x${randomDigits(2)}`,
    () => `${first}${randomDigits(1)}${last}`,
    () => `${first}${last}${randomDigits(4)}`,
    () => `${last}${first}${year}`,
    () => `${last}x${randomDigits(2)}${first}`,
    () => `${first}${randomDigits(4)}${last}`,
    () => `${first}${last}${randomLetters(1)}${randomDigits(2)}`,
    () => `${first}${randomLetters(2)}${last}${randomDigits(2)}`,
    () => `${last}${randomDigits(2)}${first}${randomDigits(2)}`,
    () => `${first}_${last}${randomDigits(3)}`,
    () => `${first}${randomLetters(1)}${last}${randomDigits(3)}`,
    () => `${last}_${first}${randomDigits(3)}`
  ];

  for (let attempt = 0; attempt < 40; attempt++){
    const maker = templates[randInt(templates.length)];
    let candidate = maker();

    if (candidate.length > 18) candidate = candidate.slice(0, 18);
    candidate = candidate.replace(/^[_\d]+/, "");
    if (!candidate) candidate = `${first}${randomDigits(4)}`;

    if (!usedSet || !usedSet.has(candidate)){
      usedSet?.add(candidate);
      return candidate;
    }
  }
  const fallback = `${first}${last}${randomDigits(5)}`.slice(0, 18);
  usedSet?.add(fallback);
  return fallback;
}

// ---------- Clipboard ----------
async function copyText(text){
  if (!text || text === "—") return false;
  try{
    if (navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(_){}

  try{
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }catch(_){
    return false;
  }
}

// ---------- UI ----------
const sectionsRoot = document.getElementById("sections");
const template = document.getElementById("sectionTemplate");
const addSectionBtn = document.getElementById("addSectionBtn");
const toastEl = document.getElementById("toast");

const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const themeIcon = document.getElementById("themeIcon");

let sectionCount = 0;

function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.remove("show");
  void toastEl.offsetWidth;
  toastEl.classList.add("show");
}

function closeAllMenus(exceptSelect){
  document.querySelectorAll(".select.open").forEach(sel => {
    if (sel !== exceptSelect) sel.classList.remove("open");
    sel.querySelector(".select-btn")?.setAttribute("aria-expanded","false");
  });
}

function setSelectValue(selectEl, label, value){
  selectEl.dataset.value = value;
  selectEl.querySelector(".select-value").textContent = label;
}

function buildCountryMenu(menuEl){
  menuEl.innerHTML = "";
  const items = [{label:"Random", value:"random"}, ...COUNTRIES.map(c => ({label:c, value:c}))];
  for (const it of items){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "select-item";
    btn.dataset.value = it.value;
    btn.textContent = it.label;
    menuEl.appendChild(btn);
  }
}

function buildReligionMenu(menuEl, countryValue){
  menuEl.innerHTML = "";
  const options = getReligionOptions(countryValue);
  const items = [{label:"Any Religion", value:"any"}, ...options.map(r => ({label:r, value:r}))];

  for (const it of items){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "select-item";
    btn.dataset.value = it.value;
    btn.textContent = it.label;
    menuEl.appendChild(btn);
  }
}

function resolveSelection(genderValue, countryValue, religionValue){
  let country = countryValue === "random" ? pickRandomCountry() : countryValue;
  let gender = genderValue === "random" ? pickRandomGender() : genderValue;

  if (!COUNTRIES.includes(country)) country = pickRandomCountry();
  if (gender !== "male" && gender !== "female") gender = pickRandomGender();

  const countryReligions = getReligionData(country) || {};
  const religion = religionValue !== "any" && countryReligions[religionValue]
    ? religionValue
    : pickRandomReligion(country);

  return { gender, country, religion };
}

async function generateName({genderValue, countryValue, religionValue, resolvedSelection}){
  const { gender, country, religion } = resolvedSelection || resolveSelection(genderValue, countryValue, religionValue);
  const religionPool = religion !== "any" ? buildFullNamePool(country, religion, gender) : [];
  const countryData = religionPool.length ? null : await loadCountryNames(country);
  const pool = religionPool.length ? religionPool : (countryData?.[gender] || []);
  const key = religionPool.length ? `${country}|${religion}|${gender}` : `${country}|${gender}`;
  const name = pickFromBag(key, pool);
  return { name, gender, country, religion };
}

function createSection(){
  sectionCount += 1;

  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector('[data-role="meta"]').textContent = `Section ${sectionCount}`;

  const state = {
    genderValue: "random",
    countryValue: "random",
    religionValue: "any",
    currentName: "",
    currentAddress: "",
    usernameUsed: new Map(), // nameKey -> Set(usernames)
  };

  const removeBtn = node.querySelector('[data-action="remove"]');
  if (sectionsRoot.children.length === 0){
    removeBtn.style.visibility = "hidden";
  }

  const countrySelect = node.querySelector('.select[data-role="country"]');
  const countryMenu = countrySelect.querySelector('[data-role="countryMenu"]');
  buildCountryMenu(countryMenu);

  const religionSelect = node.querySelector('.select[data-role="religion"]');
  const religionMenu = religionSelect.querySelector('[data-role="religionMenu"]');
  buildReligionMenu(religionMenu, state.countryValue);

  node.querySelectorAll(".select").forEach(selectEl => {
    const btn = selectEl.querySelector(".select-btn");
    const menu = selectEl.querySelector(".select-menu");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = selectEl.classList.contains("open");
      closeAllMenus(selectEl);
      selectEl.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });

    // Important: stop propagation so outside click handler doesn't instantly close while interacting/scrolling
    menu.addEventListener("pointerdown", (e) => e.stopPropagation());
    menu.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

    menu.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = e.target.closest(".select-item");
      if (!item) return;

      const value = item.dataset.value;
      const label = item.textContent.trim();

      setSelectValue(selectEl, label, value);

      if (selectEl.dataset.role === "gender") state.genderValue = value;
      if (selectEl.dataset.role === "country"){
        state.countryValue = value;
        state.religionValue = "any";
        setSelectValue(religionSelect, "Any Religion", "any");
        buildReligionMenu(religionMenu, value);
      }
      if (selectEl.dataset.role === "religion") state.religionValue = value;

      selectEl.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });

  const nameEl = node.querySelector('[data-role="nameValue"]');
  const usernameEl = node.querySelector('[data-role="usernameValue"]');
  const addressEl = node.querySelector('[data-role="addressValue"]');
  const customStateEl = node.querySelector('[data-role="customState"]');
  const customCityEl = node.querySelector('[data-role="customCity"]');
  const customZipEl = node.querySelector('[data-role="customZip"]');
  const gatewayTokenEl = node.querySelector('[data-role="gatewayToken"]');
  if (gatewayTokenEl){
    try{
      const saved = localStorage.getItem("vg_token");
      if (saved) gatewayTokenEl.value = saved;
    }catch(_){}
    gatewayTokenEl.addEventListener("input", () => {
      const val = gatewayTokenEl.value.trim();
      GATEWAY_CONFIG.token = val;
      try{ localStorage.setItem("vg_token", val); }catch(_){}
    });
  }

  function animatePop(el){
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  async function setNameAndUsername(){
    try{
      node.classList.add('loading');
      const selection = resolveSelection(state.genderValue, state.countryValue, state.religionValue);
      const { name } = await generateName({genderValue: state.genderValue, countryValue: state.countryValue, religionValue: state.religionValue, resolvedSelection: selection});
      state.currentName = name;
      nameEl.textContent = name;
      animatePop(nameEl);

      const address = await generateAddress({
        country: selection.country,
        customState: customStateEl.value,
        customCity: customCityEl.value,
        customZip: customZipEl.value
      });
      state.currentAddress = address.text;
      addressEl.textContent = address.text;
      animatePop(addressEl);

      const key = normalizeForUsername(name) || name;
      if (!state.usernameUsed.has(key)) state.usernameUsed.set(key, new Set());
      const usedSet = state.usernameUsed.get(key);

      const uname = generateUsernameFromName(name, usedSet);
      usernameEl.textContent = uname;
      animatePop(usernameEl);
    }catch(err){
      console.error(err);
      toast('Generation failed. Check data files / hosting.');
    }finally{
      node.classList.remove('loading');
    }
  }

  node.querySelector('[data-action="generate"]').addEventListener("click", setNameAndUsername);

  node.querySelector('[data-action="regenUsername"]').addEventListener("click", (e) => {
    e.stopPropagation();

    // visual feedback
    const regenBtn = e.currentTarget;
    regenBtn.classList.add("spin");
    setTimeout(() => regenBtn.classList.remove("spin"), 520);

    const name = state.currentName || nameEl.textContent;
    if (!name || name === "—"){
      toast("Generate a name first");
      return;
    }
    const key = normalizeForUsername(name) || name;
    if (!state.usernameUsed.has(key)) state.usernameUsed.set(key, new Set());
    const usedSet = state.usernameUsed.get(key);

    const uname = generateUsernameFromName(name, usedSet);
    usernameEl.textContent = uname;
    animatePop(usernameEl);
  });

  async function handleCopy(kind){
    const text = kind === "name" ? nameEl.textContent : (kind === "address" ? addressEl.textContent : usernameEl.textContent);
    const ok = await copyText(text);
    const label = kind === "name" ? "Name" : (kind === "address" ? "Address" : "Username");
    toast(ok ? `${label} copied` : "Copy failed (try HTTPS/localhost)");
  }

  const outName = node.querySelector('[data-action="copyName"]');
  const outUser = node.querySelector('[data-action="copyUsername"]');
  const outAddress = node.querySelector('[data-action="copyAddress"]');

  outName.addEventListener("click", () => handleCopy("name"));
  outUser.addEventListener("click", () => handleCopy("username"));
  outAddress.addEventListener("click", () => handleCopy("address"));

  for (const el of [outName, outUser, outAddress]){
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        el.click();
      }
    });
  }

  removeBtn.addEventListener("click", () => {
    node.remove();
    const cards = Array.from(sectionsRoot.children);
    cards.forEach((c, idx) => {
      const rb = c.querySelector('[data-action="remove"]');
      if (!rb) return;
      rb.style.visibility = cards.length > 1 ? "visible" : "hidden";
      const m = c.querySelector('[data-role="meta"]');
      if (m) m.textContent = `Section ${idx + 1}`;
    });
    toast("Section removed");
    updateAddButtonState();
  });

  sectionsRoot.appendChild(node);
  updateAddButtonState();
}

function updateAddButtonState(){
  const n = sectionsRoot.children.length;
  addSectionBtn.disabled = n >= MAX_SECTIONS;
  addSectionBtn.title = addSectionBtn.disabled ? "Maximum 5 sections" : "Add section";
}

addSectionBtn.addEventListener("click", () => {
  if (sectionsRoot.children.length >= MAX_SECTIONS){
    toast("Max 5 sections reached");
    updateAddButtonState();
    return;
  }
  createSection();
  toast("New section added");
});

document.addEventListener("click", () => closeAllMenus(null));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllMenus(null); });

// ---------- Theme ----------
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  themeLabel.textContent = isDark ? "Dark" : "Light";
  themeIcon.textContent = isDark ? "🌙" : "☀️";
  try{ localStorage.setItem("ng_theme", theme); }catch(_){}
}

function getPreferredTheme(){
  try{
    const saved = localStorage.getItem("ng_theme");
    if (saved === "light" || saved === "dark") return saved;
  }catch(_){}
  try{
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (mq && mq.matches) return "dark";
  }catch(_){}
  return "light";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

// ---------- Adblock detection ----------
function isElementBlocked(el){
  if (!el || !document.body.contains(el)) return true;
  const style = window.getComputedStyle(el);
  return style.display === "none" || style.visibility === "hidden" || el.offsetHeight === 0 || el.offsetWidth === 0;
}

function showAdblockWall(){
  const wall = document.getElementById("adblockWall");
  if (!wall || document.documentElement.classList.contains("adblock-active")) return;
  document.documentElement.classList.add("adblock-active");
  wall.hidden = false;
  wall.querySelector('[data-action="reloadPage"]')?.focus();
}

function checkAdblock(){
  const bait = document.getElementById("adblockBait");
  if (isElementBlocked(bait)) showAdblockWall();
}

document.querySelector('[data-action="reloadPage"]')?.addEventListener("click", () => location.reload());

// Boot
applyTheme(getPreferredTheme());
createSection();
window.setTimeout(checkAdblock, 3500);
