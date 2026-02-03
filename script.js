/* Name & Username Generator (clean UI)
   - Dropdown is visible/clickable (z-index + overflow fix in CSS)
   - Names are non-repeating until pool is exhausted (bag shuffle)
   - Username regeneration is "unique-looking"
*/

const MAX_SECTIONS = 5;

const COUNTRIES = [
  "American","Arabic","Indian","Bangladeshi","Pakistani","Chinese","Japanese","Korean",
  "Spanish","French","German","Russian","Italian","Turkish"
];

const NAMES = {
  American: {
    male: ["Jackson Reed","Ethan Brooks","Noah Carter","Mason Walker","Caleb Harris"],
    female: ["Ava Johnson","Emma Parker","Mia Collins","Sophia Bennett","Lily Morgan"]
  },
  Arabic: {
    male: ["Ahmed Khalid","Omar Farouk","Yusuf Rahman","Hassan Nabil","Karim Zayed"],
    female: ["Aisha Noor","Fatima Zahra","Layla Hossain","Mariam Ali","Noura Salim"]
  },
  Indian: {
    male: ["Arjun Sharma","Rohan Mehta","Amit Verma","Vivek Singh","Rahul Kapoor"],
    female: ["Priya Sharma","Ananya Gupta","Sanjana Iyer","Meera Nair","Ishita Roy"]
  },
  Bangladeshi: {
    male: ["Rana Karim Chowdhury", "Zakir Ullah", "Azhar Rabbani Sheikh", "Fahim Haque Sheikh", "Naimur Hossain", "Sourav Azad Rahman", "Pavel Azad Hasan", "Sajid Islam", "Adnan Azad Sarker", "Milon Hasan Hossain", "Zubair Sheikh", "Farhan Uddin", "Fahad Kader Alam", "Siam Hasan Alam", "Naimur Kader Haque", "Sayem Kader Miah", "Anis Hossain Khan", "Fardin Hossain Alam", "Mostafa Alam Sarker", "Shafiul Rahman", "Shawon Sarkar", "Sourov Alam Chowdhury", "Habibur Hossain Khan", "Sadi Kabir Hossain", "Mostafa Sheikh", "Naimur Khan", "Shakib Ullah", "Ruhul Rahman Sheikh", "Naimur Ullah", "Irfan Hossain", "Rayhan Hossain", "Mashrafi Karim Hasan", "Souvik Ahmed", "Shafayet Ullah", "Kamal Kabir Haque", "Zakir Rahman Sarkar", "Shihab Ullah", "Aminul Alam Bhuiyan", "Shahin Islam", "Sujon Islam", "Anik Sheikh", "Mashrafi Karim Ahmed", "Shakil Karim Rahman", "Shuvo Kader Ahmed", "Fahad Chowdhury", "Sajib Uddin Miah", "Fardin Khan", "Shawon Karim Uddin", "Sayeed Haque", "Irfan Islam", "Siam Hossain Miah", "Riyazul Azad Sheikh", "Hridoy Sarker", "Mahadi Hasan Chowdhury", "Azim Alam", "Shamim Rahman", "Saiful Haque", "Akash Chowdhury", "Atikul Haque", "Shahidul Alam Sarker", "Mizan Hasan", "Zubair Karim Miah", "Mahadi Azad Miah", "Sadi Rahman Miah", "Sayem Rahman Hasan", "Mehedi Kader Sarkar", "Tanjil Bhuiyan", "Habibur Kader Miah", "Aminul Haque", "Hossain Rahman Chowdhury", "Munna Hasan", "Sayed Rabbani Chowdhury", "Mizan Khan", "Sadiq Uddin Sarkar", "Tanvir Islam Sarker", "Azhar Siddique Ahmed", "Ruhul Alam Bhuiyan", "Milon Alam Bhuiyan", "Saif Bhuiyan", "Mahmud Rahman Hossain", "Rudro Sarkar", "Rakib Alam Hossain", "Habib Alam", "Shafi Ahmed Uddin", "Adnan Islam Sarkar", "Shahid Chowdhury", "Tanvir Rabbani Sheikh", "Rakib Hasan", "Faisal Siddique Uddin", "Shafayet Siddique Haque", "Rayyan Ullah", "Souvik Hasan Sarkar", "Atik Kabir Islam", "Fahad Khan", "Azhar Siddique Uddin", "Sumon Islam Khan", "Mehedi Bhuiyan", "Milon Hossain Sheikh", "Suman Karim Uddin", "Tanim Haque", "Shanto Siddique Sheikh", "Tasnim Azad Sarkar", "Rafsan Khan", "Rakibul Ullah", "Rakib Hossain", "Tanjil Alam", "Nazmul Miah", "Tawfiq Sarkar", "Sakib Khan", "Anik Miah", "Rony Rabbani Haque", "Tamim Rabbani Alam", "Atik Sarkar", "Sabbir Alam Khan", "Niloy Siddique Sarkar", "Rifat Uddin", "Mizan Rabbani Haque", "Pavel Haque", "Ayon Uddin", "Tasnim Karim Miah", "Jahid Ahmed Hossain", "Rayyan Uddin", "Mehedi Sarker", "Rafiul Ahmed", "Jahid Miah", "Shahriar Islam Chowdhury", "Tarek Siddique Alam", "Ziaur Islam", "Pavel Ahmed", "Abdullah Uddin Miah", "Riyaz Hasan", "Raihan Sarkar", "Sajid Uddin", "Sourov Hasan", "Aminul Hasan Ahmed", "Anik Alam Chowdhury", "Tanjil Hasan Ullah", "Fardin Kabir Sarker", "Mostafa Rahman Ahmed", "Arif Alam Haque", "Rakibul Sheikh", "Rashed Rabbani Alam", "Biplob Islam Sarkar", "Adnan Sheikh", "Rafiul Islam", "Adnan Hasan", "Dipankar Hasan Islam", "Anisul Uddin Chowdhury", "Shuvo Islam Khan", "Shafiqul Hossain Khan", "Rafsan Miah", "Tawfiq Hossain Sheikh", "Jahid Rahman", "Habibur Alam Haque", "Sakib Uddin Sarkar", "Mushfiq Kader Hossain", "Noman Ullah", "Shawon Kabir Hasan", "Raihan Bhuiyan", "Debashish Kader Bhuiyan", "Siam Chowdhury", "Imran Alam Hasan", "Shihab Haque Ahmed", "Shafayet Karim Rahman", "Azhar Ullah", "Tanjil Sarkar", "Tarek Kabir Chowdhury", "Sourav Haque Islam", "Shanto Hasan Hossain", "Tanjil Siddique Sarker", "Shakib Sheikh", "Abir Uddin Haque", "Bijoy Azad Khan", "Pavel Uddin Sarkar", "Shafi Haque Hasan", "Irfan Ahmed Sarker", "Shahidul Haque Khan", "Mithun Alam Bhuiyan", "Anis Alam Sheikh", "Bijoy Ullah", "Sujon Chowdhury", "Sakil Islam Ahmed", "Hossain Khan", "Adnan Kader Hossain", "Farhan Rahman", "Atikul Karim Alam", "Raihan Uddin Bhuiyan", "Rudro Uddin Sarkar", "Tawhid Hasan", "Asif Khan", "Hasan Hossain", "Rana Uddin", "Ruhul Haque Islam", "Saif Kabir Alam", "Junaid Sarker", "Rubel Uddin", "Shohel Azad Chowdhury", "Tamim Rahman Miah", "Sayem Chowdhury", "Mahadi Uddin Sheikh", "Amin Uddin", "Ayan Khan", "Kamal Ullah", "Sabbir Alam", "Shihab Khan", "Sayeed Islam", "Riyad Haque", "Shahriar Islam", "Sohel Sarkar", "Mithun Ullah", "Anik Ahmed Sheikh", "Amin Hasan Khan", "Tamim Alam", "Rayhan Miah", "Rayyan Sarkar", "Rafsan Hossain Uddin", "Habib Kader Chowdhury", "Azhar Alam", "Zaki Rahman Sarker", "Ahsan Ullah", "Rafsan Rahman Bhuiyan", "Tawhid Alam", "Shahid Khan", "Shohel Khan", "Anik Ullah", "Shanto Bhuiyan", "Humayun Hossain Rahman", "Azim Hasan", "Tawhid Khan", "Sakib Rabbani Haque", "Mithun Azad Khan", "Sadiq Azad Chowdhury", "Bijoy Kabir Bhuiyan", "Mithun Alam Sheikh", "Arif Bhuiyan", "Biplob Haque", "Sadi Ahmed Khan", "Junaid Rahman", "Sourov Sheikh", "Rubel Khan", "Ahnaf Hasan", "Riad Ullah", "Riyazul Khan", "Mahadi Ahmed", "Shuvo Miah", "Rashid Haque Miah", "Debashish Kabir Uddin", "Azhar Rahman", "Nayeem Hossain", "Nayeem Sarker", "Sayeed Azad Ullah", "Anisul Azad Miah", "Imran Haque", "Mahfuj Uddin Haque", "Abdullah Siddique Rahman", "Zakir Hossain", "Tamim Islam Bhuiyan", "Habib Ahmed Alam", "Sujon Uddin", "Ahnaf Haque Chowdhury", "Ashik Islam", "Sohel Hasan", "Nafis Ullah", "Sourav Rabbani Bhuiyan", "Farhan Ahmed", "Saim Hossain Uddin", "Milon Rabbani Ahmed", "Sohan Miah", "Fardin Haque Sheikh", "Jobayer Rahman Islam", "Imran Karim Uddin", "Riyazul Karim Chowdhury", "Sohel Bhuiyan", "Mehedi Sheikh", "Dipankar Kader Bhuiyan", "Rifat Hasan Hossain", "Shihab Miah", "Faisal Bhuiyan", "Kamal Uddin Chowdhury", "Shuvo Ahmed", "Rubel Bhuiyan", "Shafiq Miah", "Mostafa Islam Hasan", "Rayhan Kabir Hasan", "Mustafa Kader Ullah", "Hridoy Kabir Sarker", "Habibur Uddin Islam", "Rasel Miah", "Rana Islam Ullah", "Rayhan Hasan", "Shahriar Siddique Hossain", "Shahin Sheikh", "Zakir Uddin", "Tariq Ullah", "Ahnaf Hasan Ahmed", "Rudro Kabir Bhuiyan", "Aziz Uddin Khan", "Debashish Hossain", "Anis Ahmed Alam", "Mahfuj Sheikh", "Ahnaf Rabbani Islam", "Rafi Sheikh", "Shafi Rabbani Alam", "Mahadi Hossain Alam", "Sajid Islam Bhuiyan", "Humayun Siddique Khan", "Fahim Kader Sarkar", "Suman Ullah", "Jahid Haque", "Shuvo Sheikh", "Shamim Hasan", "Bijoy Uddin Ahmed", "Rashid Chowdhury", "Sayed Ullah", "Sayem Hasan", "Tarek Alam Sheikh", "Mostafa Uddin Sarkar", "Aziz Sarker", "Rakibul Haque Islam", "Siam Hossain Khan", "Fahad Miah", "Rasel Hasan", "Rashed Hossain Ullah", "Naimur Ahmed", "Ziaur Uddin", "Irfan Sarkar", "Sajib Chowdhury", "Suman Hasan", "Rayhan Alam", "Abir Kabir Hossain", "Rafi Islam Ahmed", "Farhan Azad Alam", "Rudro Kabir Alam", "Sohel Hossain", "Shohel Sarkar", "Sakib Ahmed", "Rakib Ahmed", "Amir Kader Miah", "Masum Islam Uddin", "Shahriar Ahmed", "Shafiq Kader Khan", "Shahriar Haque Sarkar", "Farhan Ahmed Sarkar", "Anwar Hasan", "Tasnim Alam Haque", "Zakir Khan", "Ziaur Siddique Chowdhury", "Shawon Haque Ahmed", "Sadiq Islam", "Anwar Bhuiyan", "Tanim Karim Alam", "Rafiul Sheikh", "Abir Kader Rahman", "Riyaz Chowdhury", "Nafis Rahman Hasan", "Junaid Alam Sarker", "Mahadi Rahman", "Sayed Haque", "Shafiq Rahman", "Sakil Siddique Sheikh", "Azhar Kader Uddin", "Rashed Bhuiyan", "Tawhid Ahmed", "Humayun Ahmed Sarkar", "Shuvo Haque", "Shamim Alam", "Jobayer Ullah", "Saim Islam Hossain", "Sayem Haque", "Sakil Haque Khan", "Atikul Chowdhury", "Sourav Ahmed", "Habibur Alam", "Anwar Karim Haque", "Zahid Alam Haque", "Azim Uddin Sarker", "Zahid Miah", "Jahid Rahman Islam", "Sakib Hossain Haque", "Adnan Chowdhury", "Milon Miah", "Sadiq Khan", "Shafayet Rahman", "Riyazul Alam Hasan", "Humayun Rahman Sheikh", "Jubayer Miah", "Rakib Sheikh", "Amit Karim Ahmed", "Junaid Hasan Rahman", "Sohel Kader Hossain", "Rashid Haque Khan", "Nayeem Azad Ahmed", "Mahmud Chowdhury", "Amin Haque", "Zubair Hossain Islam", "Rafi Azad Ullah", "Ayan Sarkar", "Souvik Kader Sarker", "Riyaz Hossain", "Shafi Uddin Alam", "Sabbir Chowdhury", "Rasel Rabbani Alam", "Nafis Rabbani Miah", "Jahidul Ullah", "Ayan Haque Islam", "Shawon Siddique Miah", "Rakibul Miah", "Shuvo Kabir Ullah", "Saim Haque Rahman", "Raihan Hossain Miah", "Jahid Uddin Rahman", "Habib Hossain", "Niloy Ahmed Bhuiyan", "Suman Kader Khan", "Shafiul Karim Khan", "Biplob Hasan Ullah", "Kamrul Hossain Chowdhury", "Fahad Ullah", "Jubayer Kader Khan", "Tariq Uddin", "Amit Karim Bhuiyan", "Rifat Hasan", "Mamun Hossain", "Rafi Rabbani Khan", "Shanto Ahmed", "Shakib Azad Haque", "Zahid Sarkar", "Ruhul Sarker", "Mushfiq Rahman", "Imran Sheikh", "Anwar Alam Sarkar", "Shakil Alam", "Anisul Miah", "Sabbir Hasan", "Sajib Uddin Khan", "Shawon Sarker", "Biplob Alam Ahmed", "Rakib Rahman", "Biplob Sarker", "Rafiul Bhuiyan", "Rakibul Alam Islam", "Tanjil Rahman", "Rana Karim Uddin", "Rashed Sarkar", "Anik Hasan Miah", "Shakil Hossain Sarkar", "Abir Rahman Alam", "Tanvir Rahman Hasan", "Tariq Azad Hasan", "Mahfuz Hasan", "Siam Uddin Miah", "Sayed Sarker", "Tamim Alam Uddin", "Atikul Ahmed", "Rashed Haque Rahman", "Mahfuj Haque", "Amit Haque Alam", "Naimur Islam", "Rayyan Alam", "Hridoy Khan", "Ziaur Siddique Bhuiyan", "Sajid Haque", "Sourav Azad Haque", "Mahfuj Alam", "Shakib Haque Chowdhury", "Rayhan Ullah", "Abdullah Hasan Hossain", "Riyaz Karim Khan", "Debashish Islam Sarker", "Monir Hasan Khan", "Sabbir Haque", "Rashid Miah", "Mamun Hossain Khan", "Sakib Uddin Miah", "Abdullah Sarker", "Rana Miah", "Shahriar Chowdhury", "Sohan Kabir Haque", "Zakir Siddique Khan", "Shafayet Uddin", "Akash Azad Hossain", "Sourov Chowdhury", "Naimur Karim Bhuiyan", "Shahriar Azad Chowdhury", "Zakir Hasan Alam", "Atik Hasan", "Adnan Uddin", "Mustafa Haque Uddin", "Mahmud Uddin Khan", "Sajib Azad Rahman", "Mahfuz Hasan Sarkar", "Monir Hossain Haque", "Anis Karim Sarker", "Arif Sarker", "Anis Uddin Sarker", "Shafayet Hossain Miah", "Sabbir Kabir Rahman", "Noman Uddin", "Hossain Alam Haque", "Farhan Hasan", "Pavel Haque Sarker", "Ahnaf Hossain", "Masum Bhuiyan", "Fahad Ahmed Uddin", "Tasnim Siddique Hossain", "Firoz Hossain", "Rayyan Sheikh", "Jobayer Azad Chowdhury", "Anisul Uddin", "Zakir Rahman Ahmed", "Anwar Chowdhury", "Nafis Sarkar", "Sumon Khan", "Tamim Kader Khan", "Fahad Haque Ullah", "Rafi Hasan", "Siam Uddin Bhuiyan", "Biplob Siddique Hossain", "Rafsan Kabir Uddin", "Nazmul Ullah", "Kamrul Kabir Sheikh", "Anisul Uddin Miah", "Humayun Bhuiyan", "Milon Hossain Alam", "Shafi Siddique Hasan", "Shahidul Miah", "Rifat Kader Bhuiyan", "Jobayer Siddique Sheikh", "Farhan Hossain", "Shamim Islam", "Atik Miah", "Jahidul Sarkar", "Anisul Hasan Haque", "Munna Karim Islam", "Rubel Haque", "Shafiul Ahmed Bhuiyan", "Tanvir Ullah", "Mustafa Hasan", "Sayed Khan", "Riad Haque Uddin", "Atikul Uddin", "Riyazul Hasan", "Humayun Hossain", "Ahsan Haque", "Ayan Rabbani Miah", "Sakil Uddin Rahman", "Firoz Alam", "Sumon Hossain Ullah", "Junaid Hasan Sheikh", "Shahin Haque Rahman", "Parvez Bhuiyan", "Mushfiq Azad Sheikh", "Jobayer Kader Khan", "Saif Kabir Uddin", "Tariq Siddique Miah", "Rafiul Alam", "Sayed Sarkar", "Sakib Kabir Sarker", "Faisal Hossain", "Ayon Haque", "Jahidul Kabir Ahmed", "Milon Alam", "Asif Islam Chowdhury", "Souvik Miah", "Riad Kader Sarkar", "Jahid Hasan", "Anis Ullah", "Shihab Sarker", "Riyaz Uddin Rahman", "Mostafa Hasan Ahmed", "Ayan Haque", "Souvik Chowdhury", "Fardin Kader Islam", "Rana Rabbani Sheikh", "Rafi Alam Haque", "Sadiq Haque", "Asif Ullah", "Sohan Islam Rahman", "Mamun Alam", "Masum Sarkar", "Tasnim Siddique Ullah", "Irfan Chowdhury", "Mahfuz Hasan Sarker", "Mahadi Siddique Hossain", "Arafat Uddin Rahman", "Sayed Uddin", "Kamal Bhuiyan", "Shafiqul Rahman Alam", "Pavel Siddique Sarker", "Anisul Rahman Islam", "Sajid Kabir Sheikh", "Jobayer Ahmed", "Shakil Hasan", "Sakil Hasan Chowdhury", "Ruhul Rabbani Hossain", "Rudro Karim Hossain", "Mamun Rahman", "Shahriar Islam Ullah", "Imran Haque Rahman", "Abir Hasan Chowdhury", "Shafi Ullah", "Fahim Kabir Rahman", "Biplob Haque Uddin", "Riyazul Islam", "Shanto Alam Khan", "Rayyan Karim Islam", "Akash Sarkar", "Nayeem Rabbani Sarkar", "Shahid Sarkar", "Tarek Bhuiyan", "Faisal Kader Khan", "Sourav Hasan Chowdhury", "Tasnim Miah", "Zaki Karim Miah", "Azhar Miah", "Arif Haque", "Debashish Ahmed", "Irfan Ullah", "Arafat Uddin Alam", "Rafsan Alam", "Sakib Uddin", "Shamim Haque Islam", "Parvez Hossain", "Zaki Hossain", "Mushfiq Khan", "Sohan Chowdhury", "Jubayer Hossain Hasan", "Shahidul Sarkar", "Rasel Rabbani Chowdhury", "Mustafa Islam Sarker", "Shafiul Kabir Miah", "Mahfuz Hasan Hossain", "Rana Alam", "Sourov Uddin", "Asif Sarker", "Rakib Kabir Islam", "Tariq Karim Uddin", "Zahid Hossain", "Sabbir Ullah", "Rafi Kabir Islam", "Tariq Rabbani Bhuiyan", "Bijoy Siddique Hasan", "Rafi Karim Ullah", "Ayan Rabbani Alam", "Abir Ahmed", "Mushfiq Kabir Miah", "Zakir Kabir Chowdhury", "Anis Chowdhury", "Rayyan Kader Sarker", "Tawfiq Haque Miah", "Tarek Ahmed", "Sohan Karim Islam", "Jobayer Alam Sheikh", "Faisal Karim Miah", "Saif Haque Sarker", "Jahid Bhuiyan", "Nafis Rabbani Islam", "Riad Islam Ullah", "Zaki Azad Miah", "Firoz Sheikh", "Sayed Uddin Sheikh", "Rafi Siddique Ullah", "Atik Bhuiyan", "Riyad Hasan Sheikh", "Dipankar Bhuiyan", "Habibur Khan", "Rony Kabir Miah", "Sumon Islam Miah", "Mithun Miah", "Nazmul Sarker", "Ziaur Uddin Islam", "Irfan Uddin Sarker", "Noman Miah", "Suman Alam Hasan", "Mahadi Hossain", "Arif Haque Uddin", "Arif Ahmed Haque", "Debashish Haque Sarker", "Zakir Karim Sarkar", "Humayun Uddin", "Souvik Alam Sarkar", "Shihab Haque Hossain", "Rafsan Kader Khan", "Tawhid Sheikh", "Shafiqul Hossain", "Tanvir Rahman Ullah", "Shahidul Azad Haque", "Sajid Islam Hossain", "Rayyan Chowdhury", "Ahsan Bhuiyan", "Rasel Kader Sarkar", "Shanto Ahmed Bhuiyan", "Azim Islam Hossain", "Atikul Hasan Ullah", "Anwar Azad Alam", "Zakir Sarker", "Souvik Alam Hasan", "Ayon Haque Bhuiyan", "Shafiq Alam", "Rana Hossain Uddin", "Tanim Islam", "Sujon Hossain Khan", "Shahin Haque Sarkar", "Sohel Rahman Ullah", "Sakil Hasan", "Atikul Ahmed Haque", "Hasan Haque Uddin", "Azim Rahman Haque", "Mashrafi Kabir Sarker", "Rashed Ahmed", "Habibur Rahman Uddin", "Shafiqul Hossain Sarker", "Suman Bhuiyan", "Rashid Alam", "Habib Hossain Hasan", "Riyad Khan", "Raihan Haque Miah", "Imran Islam", "Anis Kader Sarker", "Sayem Ullah", "Mahfuj Siddique Islam", "Shohel Uddin Ullah", "Sohan Kabir Alam", "Mehedi Chowdhury", "Hasan Hasan Hossain", "Bijoy Islam", "Shafiqul Hossain Haque", "Mostafa Uddin", "Shafiq Chowdhury", "Tawfiq Azad Ahmed", "Mahadi Alam Islam", "Atik Ahmed Bhuiyan", "Arafat Alam Hossain", "Masum Uddin Miah", "Ziaur Sarkar", "Shahriar Bhuiyan", "Rifat Azad Ahmed", "Mehedi Karim Bhuiyan", "Pavel Sarkar", "Sujon Alam", "Tariq Azad Rahman", "Biplob Rahman Uddin", "Kamal Rabbani Chowdhury", "Raihan Rabbani Rahman", "Parvez Uddin Ahmed", "Nayeem Ahmed Sheikh", "Tanim Kabir Miah", "Sadi Kabir Ahmed", "Riyad Karim Rahman", "Milon Hasan", "Mamun Chowdhury", "Tawhid Ullah", "Raihan Haque Ahmed", "Jahidul Siddique Hasan", "Zahid Bhuiyan", "Amin Sarker", "Shafiul Alam", "Rakibul Rahman Sarker", "Riyazul Alam", "Jubayer Azad Hossain", "Hasan Ahmed", "Saim Alam", "Nazmul Rahman Uddin", "Nafis Azad Rahman", "Sajib Siddique Chowdhury", "Kamrul Hossain Rahman", "Amir Ahmed", "Firoz Sarker", "Sourov Hossain", "Bijoy Islam Alam", "Faisal Sarkar", "Souvik Ahmed Ullah", "Sourav Miah", "Sajid Uddin Hossain", "Bijoy Rahman Alam", "Naimur Kader Alam", "Noman Rabbani Bhuiyan", "Rafiul Rahman Haque", "Debashish Kader Hossain", "Sayeed Alam Hossain", "Mahfuj Haque Uddin", "Souvik Kabir Chowdhury", "Sajid Bhuiyan", "Shafiul Islam", "Rafsan Hasan", "Sajid Sheikh", "Mithun Hossain Sarkar", "Humayun Rabbani Sarkar", "Monir Alam", "Sourav Hossain Ahmed", "Mahmud Hasan Ullah", "Abdullah Chowdhury", "Rana Siddique Hossain", "Anik Sarkar", "Rafi Islam", "Tanvir Sheikh", "Abir Alam", "Pavel Ahmed Haque", "Rudro Karim Khan", "Sohel Alam Miah", "Rakibul Karim Alam", "Arif Hossain Rahman", "Rayyan Hossain", "Rifat Haque Rahman", "Kamrul Rahman", "Sayem Alam", "Tanjil Haque Khan", "Zaki Chowdhury", "Nayeem Bhuiyan", "Mehedi Azad Islam", "Mahadi Khan", "Rana Uddin Hasan", "Imran Rabbani Sheikh", "Sayeed Haque Sheikh", "Adnan Haque Ullah", "Jahid Sarkar", "Mashrafi Azad Sheikh", "Fahad Sheikh", "Sohan Bhuiyan", "Aminul Kabir Ahmed", "Shuvo Bhuiyan", "Atik Karim Islam", "Faisal Rahman", "Irfan Miah", "Shahin Islam Chowdhury", "Shihab Sheikh", "Jahidul Kabir Sarker", "Tawhid Rahman", "Shahidul Siddique Hasan", "Ahnaf Ullah", "Mashrafi Chowdhury", "Rashed Alam Sarker", "Amin Uddin Bhuiyan", "Suman Rabbani Hossain", "Anik Ahmed Sarker", "Sayem Islam Miah", "Rayyan Haque Sarker", "Rifat Uddin Hasan", "Rashid Haque Chowdhury", "Fahad Bhuiyan", "Shakil Ahmed Uddin", "Ziaur Rahman Sarker", "Jahidul Hasan", "Farhan Miah", "Sadiq Alam Haque", "Tarek Ullah", "Rakibul Haque Sheikh", "Aminul Sarker", "Fardin Islam Hasan", "Rudro Ahmed Sheikh", "Noman Sarkar", "Tawfiq Rahman Uddin", "Abdullah Uddin Khan", "Nayeem Miah", "Sajib Azad Haque", "Akash Islam", "Shanto Siddique Ahmed", "Irfan Alam Rahman", "Jobayer Haque", "Fahim Sarker", "Mithun Islam Haque", "Shakib Azad Hasan", "Jahidul Siddique Islam", "Kamal Islam", "Pavel Hossain Ahmed", "Jahid Hossain Miah", "Ziaur Ahmed", "Abdullah Khan", "Humayun Ahmed", "Amit Sarker", "Rayhan Chowdhury", "Saif Rabbani Sarkar", "Masum Alam", "Mamun Islam", "Sakib Rabbani Ahmed", "Biplob Sarkar", "Zakir Alam", "Mamun Rahman Hossain", "Saiful Rahman Haque", "Rakibul Karim Khan", "Mahmud Uddin Sarkar", "Mizan Haque", "Munna Karim Miah", "Naimur Islam Alam", "Sumon Rabbani Sarkar", "Rafsan Kader Rahman", "Amin Kabir Islam", "Tanim Alam", "Monir Kader Sarker", "Junaid Kabir Islam", "Hossain Sarker", "Hossain Alam", "Shahin Azad Rahman", "Kamrul Kabir Ullah", "Mamun Uddin Sheikh", "Parvez Haque", "Azim Haque", "Saiful Sheikh", "Asif Islam Uddin", "Rashed Rabbani Uddin", "Suman Rahman Uddin", "Rafsan Uddin Hossain", "Pavel Hossain", "Nazmul Islam", "Ayon Sheikh", "Abdullah Uddin Hasan", "Shafiul Uddin Hossain", "Rayyan Uddin Haque", "Mahfuz Bhuiyan", "Arif Azad Bhuiyan", "Amin Uddin Chowdhury", "Zaki Haque", "Rafsan Ahmed Sarkar", "Kamrul Uddin Hasan", "Nafis Haque Bhuiyan", "Asif Ahmed Chowdhury", "Biplob Rabbani Alam", "Asif Karim Miah", "Imran Hossain Bhuiyan", "Hossain Ahmed Hasan", "Atik Rabbani Ullah", "Niloy Ullah", "Shafi Haque", "Azhar Sarkar", "Anwar Karim Ahmed", "Anwar Ahmed", "Milon Bhuiyan", "Jubayer Hossain Islam", "Hridoy Sheikh", "Saim Haque Hasan", "Jahidul Miah", "Ayan Haque Uddin", "Rakib Siddique Sheikh", "Biplob Azad Rahman", "Saiful Siddique Islam", "Ahsan Ahmed Uddin", "Biplob Kabir Ahmed", "Shakil Ahmed", "Mehedi Alam Rahman", "Aziz Kabir Hossain", "Hasan Hasan Sheikh", "Saif Sarkar", "Shafi Islam", "Riad Miah", "Habib Karim Chowdhury", "Rifat Ahmed Sheikh", "Anis Miah", "Aminul Kabir Sarker", "Ashik Uddin", "Mushfiq Azad Hasan", "Abir Hasan Rahman", "Mahfuj Rahman", "Farhan Alam", "Tanim Ahmed Sheikh", "Sadi Karim Miah", "Mithun Sheikh", "Suman Azad Miah", "Ahnaf Islam Sarker", "Mashrafi Sheikh", "Tawhid Alam Islam", "Ziaur Sarker", "Mahmud Haque Ahmed", "Shohel Bhuiyan", "Shahid Alam", "Sabbir Ahmed Hasan", "Riyaz Sarker", "Raihan Siddique Alam", "Ayon Islam", "Ruhul Miah", "Riyad Kader Islam", "Saim Hasan", "Tawfiq Ullah", "Ashik Azad Miah", "Habib Uddin", "Mustafa Kabir Sheikh", "Tanjil Azad Bhuiyan", "Tawhid Kabir Bhuiyan", "Sumon Rahman Sheikh", "Saim Islam", "Ayan Rahman Sheikh", "Humayun Azad Rahman", "Rasel Islam Bhuiyan", "Shanto Islam Miah", "Sakib Uddin Hasan", "Shafiq Siddique Bhuiyan", "Zakir Rabbani Sarkar", "Bijoy Hasan Sarker", "Niloy Rahman Ullah", "Sayed Hossain", "Mashrafi Alam Bhuiyan", "Dipankar Rahman", "Shakil Haque", "Debashish Kader Sarker", "Mahadi Kader Hasan", "Rakib Haque Rahman", "Sourov Miah", "Arafat Sarker", "Rafi Islam Sheikh", "Azhar Islam", "Aminul Hossain Rahman"],
    female: ["Riya Jannat","Nusrat Jahan","Jannatul Ferdous","Sadia Ahmed","Sharmin Akter"]
  },
  Pakistani: {
    male: ["Ahsan Ali","Hamza Khan","Usman Iqbal","Bilal Ahmed","Fahad Raza"],
    female: ["Ayesha Khan","Hira Noor","Sana Iqbal","Maryam Tariq","Iqra Ahmed"]
  },
  Chinese: {
    male: ["Li Wei","Wang Jun","Zhang Hao","Chen Ming","Liu Yang"],
    female: ["Wang Xinyi","Li Na","Zhang Yuxin","Chen Lihua","Liu Meilin"]
  },
  Japanese: {
    male: ["Haruto Sato","Ren Tanaka","Sota Nakamura","Yuto Suzuki","Kaito Watanabe"],
    female: ["Yui Sato","Hina Tanaka","Sakura Suzuki","Rin Nakamura","Aoi Watanabe"]
  },
  Korean: {
    male: ["Min-jun Kim","Seo-jun Lee","Do-yun Park","Ji-hoon Choi","Hyun-woo Jung"],
    female: ["Seo-yeon Kim","Ji-woo Lee","Ha-eun Park","Min-seo Choi","Su-bin Jung"]
  },
  Spanish: {
    male: ["Mateo García","Lucas Martínez","Daniel López","Alejandro Ruiz","Santiago Pérez"],
    female: ["Sofía García","Valeria Martínez","Isabella López","Camila Ruiz","Lucía Pérez"]
  },
  French: {
    male: ["Louis Martin","Gabriel Dubois","Hugo Laurent","Arthur Moreau","Jules Bernard"],
    female: ["Chloé Martin","Camille Dubois","Emma Laurent","Manon Moreau","Léa Bernard"]
  },
  German: {
    male: ["Lukas Müller","Jonas Schneider","Felix Fischer","Leon Weber","Noah Wagner"],
    female: ["Mia Müller","Hannah Schneider","Lea Fischer","Emilia Weber","Lina Wagner"]
  },
  Russian: {
    male: ["Ivan Petrov","Dmitri Ivanov","Sergei Smirnov","Nikolai Volkov","Alexei Kuznetsov"],
    female: ["Anastasia Petrova","Elena Ivanova","Maria Smirnova","Sofia Volkova","Olga Kuznetsova"]
  },
  Italian: {
    male: ["Luca Rossi","Marco Bianchi","Matteo Conti","Giovanni Romano","Alessandro Greco"],
    female: ["Sofia Rossi","Giulia Bianchi","Aurora Conti","Francesca Romano","Martina Greco"]
  },
  Turkish: {
    male: ["Mehmet Yılmaz","Ahmet Demir","Mustafa Kaya","Emre Şahin","Ali Çelik"],
    female: ["Elif Yılmaz","Zeynep Demir","Ayşe Kaya","Merve Şahin","Selin Çelik"]
  }
};

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

function resolveSelection(genderValue, countryValue){
  let country = countryValue === "random" ? pickRandomCountry() : countryValue;
  let gender = genderValue === "random" ? pickRandomGender() : genderValue;

  if (!COUNTRIES.includes(country)) country = pickRandomCountry();
  if (gender !== "male" && gender !== "female") gender = pickRandomGender();

  return { gender, country };
}

function generateName({genderValue, countryValue}){
  const { gender, country } = resolveSelection(genderValue, countryValue);
  const pool = NAMES?.[country]?.[gender] || [];
  const key = `${country}|${gender}`;
  const name = pickFromBag(key, pool);
  return { name, gender, country };
}

function createSection(){
  sectionCount += 1;

  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector('[data-role="meta"]').textContent = `Section ${sectionCount}`;

  const state = {
    genderValue: "random",
    countryValue: "random",
    currentName: "",
    usernameUsed: new Map(), // nameKey -> Set(usernames)
  };

  const removeBtn = node.querySelector('[data-action="remove"]');
  if (sectionsRoot.children.length === 0){
    removeBtn.style.visibility = "hidden";
  }

  const countrySelect = node.querySelector('.select[data-role="country"]');
  const countryMenu = countrySelect.querySelector('[data-role="countryMenu"]');
  buildCountryMenu(countryMenu);

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
      if (selectEl.dataset.role === "country") state.countryValue = value;

      selectEl.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });

  const nameEl = node.querySelector('[data-role="nameValue"]');
  const usernameEl = node.querySelector('[data-role="usernameValue"]');

  function animatePop(el){
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
  }

  function setNameAndUsername(){
    const { name } = generateName({genderValue: state.genderValue, countryValue: state.countryValue});
    state.currentName = name;
    nameEl.textContent = name;
    animatePop(nameEl);

    const key = normalizeForUsername(name) || name;
    if (!state.usernameUsed.has(key)) state.usernameUsed.set(key, new Set());
    const usedSet = state.usernameUsed.get(key);

    const uname = generateUsernameFromName(name, usedSet);
    usernameEl.textContent = uname;
    animatePop(usernameEl);
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
    const text = kind === "name" ? nameEl.textContent : usernameEl.textContent;
    const ok = await copyText(text);
    toast(ok ? `${kind === "name" ? "Name" : "Username"} copied` : "Copy failed (try HTTPS/localhost)");
  }

  const outName = node.querySelector('[data-action="copyName"]');
  const outUser = node.querySelector('[data-action="copyUsername"]');

  outName.addEventListener("click", () => handleCopy("name"));
  outUser.addEventListener("click", () => handleCopy("username"));

  for (const el of [outName, outUser]){
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

// Boot
applyTheme(getPreferredTheme());
createSection();
