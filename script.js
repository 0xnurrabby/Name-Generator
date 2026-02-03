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
    male: ["Akib Khan",
    "Amin Miah",
    "Amit Miah",
    "Riad Khan",
    "Said Khan",
    "Said Miah",
    "Saif Miah",
    "Abir Uddin",
    "Abir Ullah",
    "Akib Ahmed",
    "Akib Islam",
    "Ameer Khan",
    "Amir Uddin",
    "Amit Islam",
    "Anik Ahmed",
    "Anis Hasan",
    "Atik Ullah",
    "Ayan Islam",
    "Ayan Uddin",
    "Ayon Hasan",
    "Ayon Ullah",
    "Azim Hasan",
    "Firoz Khan",
    "Habib Khan",
    "Helal Khan",
    "Imran Khan",
    "Jabir Khan",
    "Jamal Miah",
    "Jony Uddin",
    "Mizan Miah",
    "Monir Khan",
    "Naif Ullah",
    "Naim Ahmed",
    "Naim Islam",
    "Nayon Khan",
    "Noyon Khan",
    "Nuru Ullah",
    "Rafi Hasan",
    "Rafi Islam",
    "Rafid Khan",
    "Rana Ullah",
    "Rasel Khan",
    "Riad Ahmed",
    "Riad Islam",
    "Ridoy Miah",
    "Riyaz Khan",
    "Riyaz Miah",
    "Ruhul Khan",
    "Sadi Ullah",
    "Sadiq Khan",
    "Sadiq Miah",
    "Said Ahmed",
    "Said Islam",
    "Saim Hasan",
    "Sayed Khan",
    "Shami Miah",
    "Siam Hasan",
    "Sohel Miah",
    "Suman Miah",
    "Sumon Miah",
    "Taif Islam",
    "Tarek Khan",
    "Zakir Miah",
    "Ziaur Khan",
    "Abir Sarkar",
    "Ahnaf Islam",
    "Akash Hasan",
    "Ameer Ahmed",
    "Ameer Ullah",
    "Amir Sarker",
    "Anik Rahman",
    "Anis Sarkar",
    "Ashik Ullah",
    "Ashiq Islam",
    "Atik Sheikh",
    "Atikul Miah",
    "Atikur Miah",
    "Ayon Sarkar",
    "Azhar Ullah",
    "Azim Sheikh",
    "Bijoy Ahmed",
    "Biplab Miah",
    "Fahad Islam",
    "Firoz Islam",
    "Firoz Ullah",
    "Habib Ullah",
    "Helal Hasan",
    "Helal Islam",
    "Imran Hasan",
    "Jamal Hasan",
    "Jony Sarker",
    "Kamal Islam",
    "Karim Islam",
    "Mahadi Khan",
    "Masum Uddin",
    "Milan Ullah",
    "Milon Ahmed",
    "Milon Islam",
    "Milon Uddin",
    "Mithun Miah",
    "Mizan Ahmed",
    "Monir Ahmed",
    "Munna Hasan",
    "Munna Islam",
    "Munna Ullah",
    "Nafis Hasan",
    "Nafis Uddin",
    "Nafiz Ullah",
    "Naim Sarkar",
    "Naim Sarker",
    "Noman Ahmed",
    "Noman Ullah",
    "Noyon Ahmed",
    "Nuru Sarkar",
    "Nurul Uddin",
    "Pappu Ahmed",
    "Rafid Ullah",
    "Rahim Ahmed",
    "Rahim Ullah",
    "Rakib Hasan",
    "Rana Sarker",
    "Rasel Hasan",
    "Rashid Khan",
    "Ridoy Hasan",
    "Ridoy Islam",
    "Ridoy Uddin",
    "Riyaz Islam",
    "Roni Rahman",
    "Ronny Hasan",
    "Ronny Islam",
    "Ronny Ullah",
    "Rudra Islam",
    "Rudra Uddin",
    "Rudra Ullah",
    "Sadi Sarkar",
    "Saeed Hasan",
    "Saeed Islam",
    "Saif Rahman",
    "Saim Sarker",
    "Sajib Islam",
    "Sajid Ahmed",
    "Sakil Islam",
    "Sayed Hasan",
    "Sayem Hasan",
    "Shafi Uddin",
    "Shahid Miah",
    "Shakib Miah",
    "Shakil Miah",
    "Shami Hasan",
    "Shamim Khan",
    "Siam Sarkar",
    "Sohel Hasan",
    "Sujan Hasan",
    "Sumon Ahmed",
    "Sumon Uddin",
    "Tamim Hasan",
    "Tanim Ahmed",
    "Tarek Islam",
    "Tariq Islam",
    "Tasnim Khan",
    "Tawhid Miah",
    "Abir Hossain",
    "Ahsan Rahman",
    "Ahsan Sarker",
    "Ahsan Sheikh",
    "Amit Hossain",
    "Anik Hossain",
    "Anisul Hasan",
    "Anwar Rahman",
    "Anwar Sarkar",
    "Arif Bhuiyan",
    "Ashik Sheikh",
    "Atik Hossain",
    "Atikul Ullah",
    "Ayaan Sarker",
    "Ayaan Sheikh",
    "Azhar Sarkar",
    "Azharul Khan",
    "Azharul Miah",
    "Azim Bhuiyan",
    "Aziz Hossain",
    "Bijoy Rahman",
    "Fardin Ahmed",
    "Fardin Hasan",
    "Fardin Islam",
    "Firoz Sarkar",
    "Foysal Ullah",
    "Golam Sheikh",
    "Hossain Miah",
    "Hridoy Ahmed",
    "Humayun Khan",
    "Imran Rahman",
    "Imran Sheikh",
    "Irfan Rahman",
    "Irfan Sarkar",
    "Jabir Sheikh",
    "Jamal Sarker",
    "Jony Bhuiyan",
    "Jubayer Miah",
    "Junaid Ullah",
    "Kamrul Islam",
    "Karim Sarkar",
    "Mahadi Ullah",
    "Mahfuj Ullah",
    "Mahfuz Ahmed",
    "Mahfuz Uddin",
    "Mizan Rahman",
    "Munna Sarkar",
    "Naif Hossain",
    "Naimur Ahmed",
    "Naimur Uddin",
    "Nayon Rahman",
    "Nayon Sarkar",
    "Nayon Sarker",
    "Nazmul Ahmed",
    "Niloy Sheikh",
    "Noyon Rahman",
    "Nurul Sarkar",
    "Rafid Sheikh",
    "Rafiul Islam",
    "Rahim Rahman",
    "Raiyan Ullah",
    "Rashed Islam",
    "Rashed Uddin",
    "Rashid Uddin",
    "Rayan Sarkar",
    "Rayan Sheikh",
    "Rifat Rahman",
    "Riyadh Hasan",
    "Rohim Sarkar",
    "Ronny Sarkar",
    "Rudro Sarkar",
    "Ruhul Rahman",
    "Sakib Sarker",
    "Sayed Sarkar",
    "Shafiq Uddin",
    "Shahid Hasan",
    "Shahin Ullah",
    "Shakib Hasan",
    "Shakib Islam",
    "Shakil Ahmed",
    "Shakil Islam",
    "Shawon Hasan",
    "Shihab Uddin",
    "Shohel Uddin",
    "Sohan Sheikh",
    "Sourav Ullah",
    "Sourov Uddin",
    "Sujan Rahman",
    "Sujon Sarker",
    "Tanim Sarker",
    "Tanjil Hasan",
    "Tanvir Hasan",
    "Tarek Rahman",
    "Tawfiq Ahmed",
    "Adnan Bhuiyan",
    "Ahsan Bhuiyan",
    "Ameer Bhuiyan",
    "Atikur Sarkar",
    "Azhar Bhuiyan",
    "Biplab Sarker",
    "Delwar Sarker",
    "Dipankar Miah",
    "Fahim Hossain",
    "Firozul Uddin",
    "Foysal Rahman",
    "Foysal Sarker",
    "Golam Hossain",
    "Hossain Ahmed",
    "Irfan Hossain",
    "Jabir Bhuiyan",
    "Jabir Hossain",
    "Jahidul Ahmed",
    "Jamal Hossain",
    "Jubayer Ullah",
    "Junayed Hasan",
    "Junayed Uddin",
    "Junayed Ullah",
    "Kamal Hossain",
    "Kamrul Sarkar",
    "Kamrul Sheikh",
    "Mahfuz Sarkar",
    "Mahmood Ullah",
    "Mahmud Sarkar",
    "Masum Hossain",
    "Mithun Rahman",
    "Mizanur Ahmed",
    "Monirul Uddin",
    "Mushfiq Ahmed",
    "Mustafa Ullah",
    "Nafis Bhuiyan",
    "Nafiz Bhuiyan",
    "Naimur Sarkar",
    "Rafid Bhuiyan",
    "Rafiul Sheikh",
    "Rahim Bhuiyan",
    "Raihanul Khan",
    "Rakibul Uddin",
    "Rakibul Ullah",
    "Rashedul Miah",
    "Rayyan Sarkar",
    "Rayyan Sheikh",
    "Riyadh Rahman",
    "Riyaz Bhuiyan",
    "Riyazul Ullah",
    "Ronny Hossain",
    "Rubel Hossain",
    "Rudra Bhuiyan",
    "Sabbir Rahman",
    "Sadiqur Islam",
    "Sadiqur Ullah",
    "Sakil Bhuiyan",
    "Sayed Bhuiyan",
    "Shafiqul Khan",
    "Shahid Rahman",
    "Shahin Rahman",
    "Shakil Sarkar",
    "Shanto Sarkar",
    "Shanto Sarker",
    "Shaquil Uddin",
    "Shawon Sarkar",
    "Shohel Rahman",
    "Souvik Sheikh",
    "Sujan Bhuiyan",
    "Sujon Hossain",
    "Tamim Bhuiyan",
    "Tanjim Sarker",
    "Tarek Bhuiyan",
    "Tariqul Ahmed",
    "Tasnim Sarkar",
    "Tawfiq Sheikh",
    "Abdullah Ahmed",
    "Abdullah Hasan",
    "Arafat Hossain",
    "Atikul Hossain",
    "Dipankar Uddin",
    "Hossain Sarker",
    "Junayed Sarker",
    "Junayed Sheikh",
    "Mahfuz Hossain",
    "Mostaque Ahmed",
    "Mostaque Uddin",
    "Mushfiq Rahman",
    "Naim Chowdhury",
    "Nazmul Hossain",
    "Parvez Bhuiyan",
    "Rafiul Hossain",
    "Rashed Bhuiyan",
    "Rashidul Uddin",
    "Rayyan Hossain",
    "Riyadul Sarker",
    "Saif Chowdhury",
    "Sajeeb Bhuiyan",
    "Shafiqur Islam",
    "Shafiqur Uddin",
    "Shahid Hossain",
    "Shahriar Ahmed",
    "Shaquil Sheikh",
    "Souvik Hossain",
    "Tafsirul Ullah",
    "Tariqul Sarker",
    "Tawfiq Bhuiyan",
    "Ahsan Chowdhury",
    "Ayaan Chowdhury",
    "Debashish Islam",
    "Golam Chowdhury",
    "Jaber Chowdhury",
    "Jabir Chowdhury",
    "Jahidul Hossain",
    "Junayed Bhuiyan",
    "Mamun Chowdhury",
    "Masum Chowdhury",
    "Mostaque Rahman",
    "Mushfiqur Ahmed",
    "Mushfiqur Hasan",
    "Mushfiqur Uddin",
    "Niloy Chowdhury",
    "Nurul Chowdhury",
    "Raihanul Rahman",
    "Rashedul Sarkar",
    "Rashedul Sarker",
    "Rudra Chowdhury",
    "Shafayet Sarker",
    "Shafi Chowdhury",
    "Shafiqul Rahman",
    "Shahriar Sarker",
    "Suman Chowdhury",
    "Zahid Chowdhury",
    "Ziaur Chowdhury",
    "Abdullah Bhuiyan",
    "Aminul Chowdhury",
    "Biplab Chowdhury",
    "Jubair Chowdhury",
    "Mahfuz Chowdhury",
    "Rashedul Hossain",
    "Rashidul Hossain",
    "Shafiqur Bhuiyan",
    "Shahid Chowdhury",
    "Shahriar Hossain",
    "Shawon Chowdhury",
    "Sourov Chowdhury",
    "Tafsirul Bhuiyan",
    "Tanvir Chowdhury",
    "Mushfiqur Bhuiyan",
    "Riyadul Chowdhury",
    "Riyazul Chowdhury",
    "Mushfiqur Chowdhury",
    "Amit Saha Khan",
    "Rony Noor Khan",
    "Abir Hasan Khan",
    "Abir Hasan Miah",
    "Abir Uddin Khan",
    "Amit Abdul Miah",
    "Amit Saha Ullah",
    "Anik Hasan Khan",
    "Aqib Uddin Miah",
    "Ayon Ahmed Khan",
    "Ayon Ahmed Miah",
    "Ayon Hasan Khan",
    "Naif Abdur Khan",
    "Rana Ibne Hasan",
    "Rana Noor Ullah",
    "Rony Noor Uddin",
    "Ruhul Amin Khan",
    "Sadi Ahmed Khan",
    "Abdur Rahim Miah",
    "Abir Hasan Ahmed",
    "Abir Hasan Islam",
    "Abir Hasan Uddin",
    "Abir Hasan Ullah",
    "Ahsan Habib Khan",
    "Akib Hasan Ahmed",
    "Anik Abdur Islam",
    "Anik Hasan Islam",
    "Anik Rahman Miah",
    "Arif Hasan Ahmed",
    "Arif Hasan Ullah",
    "Arif Ibne Sheikh",
    "Arif Noor Sarkar",
    "Asif Ibne Sheikh",
    "Ayon Hasan Islam",
    "Ayon Nurul Hasan",
    "Foysal Ibne Khan",
    "Foysal Khan Miah",
    "Habib Abdur Khan",
    "Habib Noor Hasan",
    "Helal Uddin Khan",
    "Jamal Noor Hasan",
    "Karim Abdur Miah",
    "Mamun Noor Islam",
    "Munna Ahmed Miah",
    "Munna Noor Ahmed",
    "Nafis Noor Ullah",
    "Nafiz Ibne Ahmed",
    "Nayon Noor Hasan",
    "Niloy Abdul Miah",
    "Noman Islam Miah",
    "Noor Abdur Islam",
    "Pappu Abdul Miah",
    "Rafi Abdul Uddin",
    "Rafid Hasan Khan",
    "Rahim Uddin Khan",
    "Rasel Islam Miah",
    "Rayan Hasan Khan",
    "Riyad Noor Islam",
    "Roni Rahman Khan",
    "Ronny Hasan Miah",
    "Rubel Abdur Miah",
    "Ruhul Amin Hasan",
    "Said Uddin Hasan",
    "Saim Abdul Hasan",
    "Saim Abdur Ahmed",
    "Sakib Hasan Miah",
    "Sakil Noor Ullah",
    "Shafiq Noor Khan",
    "Shuvo Ahmed Miah",
    "Shuvo Hasan Miah",
    "Shuvo Islam Khan",
    "Sujon Islam Khan",
    "Tamim Islam Miah",
    "Tawfiq Noor Khan",
    "Abdul Karim Hasan",
    "Abdul Karim Ullah",
    "Abdur Rahman Khan",
    "Abir Hasan Rahman",
    "Abir Hasan Sarkar",
    "Abir Islam Sarkar",
    "Ahsan Abdul Uddin",
    "Ahsan Habib Islam",
    "Akash Hasan Ullah",
    "Akash Rahman Miah",
    "Akib Hasan Rahman",
    "Ameer Hasan Ahmed",
    "Amir Hasan Rahman",
    "Amit Saha Hossain",
    "Anik Hasan Sarker",
    "Anisul Ahmed Khan",
    "Aqib Hossain Miah",
    "Arif Abdul Rahman",
    "Arif Nurul Sarkar",
    "Ashiq Abdur Islam",
    "Asif Islam Sheikh",
    "Ayon Abdur Sarker",
    "Ayon Ahmed Rahman",
    "Ayon Ahmed Sheikh",
    "Ayon Hasan Rahman",
    "Ayon Hasan Sarkar",
    "Azhar Abdul Hasan",
    "Azim Uddin Sarker",
    "Bijoy Abdur Hasan",
    "Bijoy Noor Sarkar",
    "Delwar Noor Ullah",
    "Fahad Hasan Ullah",
    "Firoz Islam Uddin",
    "Foysal Ahmed Miah",
    "Foysal Khan Ahmed",
    "Foysal Khan Islam",
    "Foysal Khan Ullah",
    "Habib Hasan Ahmed",
    "Helal Uddin Islam",
    "Jahid Hasan Ahmed",
    "Jahid Noor Sarker",
    "Jamal Uddin Ahmed",
    "Jamal Uddin Hasan",
    "Jamal Uddin Ullah",
    "Jony Nurul Sarker",
    "Mahfuj Abdul Khan",
    "Mahfuj Hasan Miah",
    "Mahfuz Noor Islam",
    "Mamun Islam Uddin",
    "Mehdi Noor Sarker",
    "Milon Hasan Islam",
    "Monir Abdul Uddin",
    "Munna Ahmed Islam",
    "Nafis Abdur Hasan",
    "Nafiz Ahmed Uddin",
    "Niloy Noor Sarker",
    "Nurul Hasan Ahmed",
    "Nurul Islam Uddin",
    "Rafid Abdul Ullah",
    "Rafid Hasan Ahmed",
    "Rafid Hasan Ullah",
    "Rafiul Ibne Ullah",
    "Rafsan Hasan Khan",
    "Rasel Ahmed Uddin",
    "Rasel Islam Hasan",
    "Rasel Islam Uddin",
    "Rasel Khan Sarkar",
    "Rasel Uddin Islam",
    "Rayyan Abdur Khan",
    "Riyad Uddin Ahmed",
    "Riyadh Abdul Khan",
    "Riyadh Islam Miah",
    "Ronny Islam Ullah",
    "Rudra Abdul Hasan",
    "Ruhul Amin Sarkar",
    "Ruhul Amin Sheikh",
    "Ruhul Islam Hasan",
    "Saeed Ibne Sarker",
    "Said Abdur Sarkar",
    "Sajeeb Noor Ahmed",
    "Sajib Rahman Miah",
    "Sajid Noor Rahman",
    "Sakib Hasan Ullah",
    "Sakil Ibne Sheikh",
    "Sayed Islam Ullah",
    "Shafiq Noor Hasan",
    "Shafiq Noor Ullah",
    "Shamim Ahmed Khan",
    "Shamim Hasan Khan",
    "Shamim Hasan Miah",
    "Shihab Hasan Khan",
    "Shihab Uddin Khan",
    "Shihab Uddin Miah",
    "Shuvo Hasan Ahmed",
    "Shuvo Islam Hasan",
    "Shuvo Noor Sarker",
    "Sohan Nurul Hasan",
    "Sujan Abdur Ahmed",
    "Tamim Abdul Ullah",
    "Tamim Iqbal Islam",
    "Tamim Uddin Ullah",
    "Tanjil Noor Islam",
    "Zahid Hasan Uddin",
    "Zahid Hasan Ullah",
    "Ziaur Rahman Miah",
    "Ahsan Abdur Rahman",
    "Akib Hasan Hossain",
    "Aminul Islam Hasan",
    "Amir Hossain Uddin",
    "Anik Hasan Hossain",
    "Anwar Hossain Khan",
    "Aqib Hossain Ahmed",
    "Aqib Hossain Islam",
    "Ashik Hasan Sarkar",
    "Atik Islam Hossain",
    "Atikul Uddin Hasan",
    "Atikur Uddin Islam",
    "Ayan Ahmed Bhuiyan",
    "Ayon Ahmed Hossain",
    "Azhar Islam Sarkar",
    "Aziz Abdul Bhuiyan",
    "Dipankar Noor Khan",
    "Fardin Hasan Islam",
    "Firoz Rahman Ahmed",
    "Firozul Islam Khan",
    "Firozul Islam Miah",
    "Firozul Uddin Miah",
    "Foysal Ahmed Islam",
    "Foysal Hasan Ullah",
    "Foysal Khan Sarker",
    "Foysal Khan Sheikh",
    "Golam Rabbani Khan",
    "Golam Rabbani Miah",
    "Habib Ahmed Sarker",
    "Habib Uddin Rahman",
    "Helal Abdul Sarkar",
    "Helal Uddin Rahman",
    "Helal Uddin Sarker",
    "Helal Uddin Sheikh",
    "Jahid Ahmed Rahman",
    "Jahid Noor Hossain",
    "Jamal Abdur Sarker",
    "Jamal Uddin Sarker",
    "Jony Hasan Bhuiyan",
    "Jubair Abdul Islam",
    "Jubayer Uddin Khan",
    "Junaid Rahman Khan",
    "Kamal Islam Sarker",
    "Mahadi Abdul Ullah",
    "Mahadi Hasan Ahmed",
    "Mahadi Hasan Ullah",
    "Mahfuj Hasan Uddin",
    "Mahmud Abdul Islam",
    "Mehdi Rahman Hasan",
    "Mizan Uddin Sarker",
    "Munna Ahmed Sarker",
    "Munna Ahmed Sheikh",
    "Nayon Islam Sarkar",
    "Nayon Noor Hossain",
    "Nazmul Ahmed Islam",
    "Nazmul Hasan Islam",
    "Nazmul Islam Uddin",
    "Niloy Abdul Rahman",
    "Nurul Hossain Miah",
    "Nurul Rahman Ahmed",
    "Nurul Uddin Sarkar",
    "Rafiul Islam Hasan",
    "Rafsan Ahmed Islam",
    "Rafsan Ahmed Uddin",
    "Rafsan Hasan Uddin",
    "Raiyan Noor Sheikh",
    "Rashedul Noor Khan",
    "Rayan Ahmed Sheikh",
    "Rayan Hasan Sarkar",
    "Rayan Hasan Sarker",
    "Rayan Hasan Sheikh",
    "Rayan Noor Bhuiyan",
    "Rayyan Abdur Ullah",
    "Riyadul Hasan Khan",
    "Riyadul Hasan Miah",
    "Riyadul Ibne Uddin",
    "Riyaz Hasan Rahman",
    "Ronny Ahmed Rahman",
    "Rudro Abdur Sarker",
    "Ruhul Amin Bhuiyan",
    "Ruhul Islam Sarkar",
    "Ruhul Islam Sarker",
    "Ruhul Islam Sheikh",
    "Ruhul Quddus Ahmed",
    "Sabbir Hasan Ahmed",
    "Sabbir Islam Ahmed",
    "Sadi Hossain Hasan",
    "Sadiq Abdul Sarkar",
    "Sadiqur Abdul Khan",
    "Sadiqur Islam Miah",
    "Saeed Islam Rahman",
    "Sajid Islam Sarker",
    "Sajid Rahman Uddin",
    "Sakib Hasan Sarker",
    "Shafi Rahman Ullah",
    "Shafiul Islam Khan",
    "Shakib Abdur Ahmed",
    "Shakib Hasan Islam",
    "Shamim Abdur Uddin",
    "Shamim Ahmed Hasan",
    "Shamim Ahmed Islam",
    "Shamim Hasan Ahmed",
    "Shamim Hasan Islam",
    "Shamim Hasan Uddin",
    "Shanto Hasan Ahmed",
    "Shanto Hasan Islam",
    "Shanto Hasan Ullah",
    "Shihab Uddin Ullah",
    "Shohel Abdul Ahmed",
    "Shuvo Hasan Sarkar",
    "Shuvo Hasan Sheikh",
    "Shuvo Islam Rahman",
    "Sohan Uddin Sheikh",
    "Sourav Ahmed Hasan",
    "Suman Abdur Sarker",
    "Tafsir Ahmed Uddin",
    "Tafsirul Noor Miah",
    "Tamim Iqbal Sarkar",
    "Tanvir Ahmed Hasan",
    "Tanvir Ahmed Uddin",
    "Tariq Ahmed Sarkar",
    "Tasnim Uddin Ahmed",
    "Tawfiq Uddin Ahmed",
    "Zahid Hasan Sheikh",
    "Zakir Hossain Miah",
    "Zakir Noor Bhuiyan",
    "Zubayer Hasan Miah",
    "Abdul Karim Hossain",
    "Amin Noor Chowdhury",
    "Anisul Abdur Sarker",
    "Anisul Noor Hossain",
    "Anwar Hossain Hasan",
    "Anwar Rahman Sarker",
    "Aqib Hossain Rahman",
    "Ashik Nurul Hossain",
    "Ashiq Abdur Bhuiyan",
    "Atikul Abdul Rahman",
    "Azhar Islam Hossain",
    "Azharul Islam Ahmed",
    "Azharul Islam Ullah",
    "Biplab Islam Rahman",
    "Dipankar Saha Ahmed",
    "Dipankar Saha Hasan",
    "Fardin Ahmed Rahman",
    "Fardin Ahmed Sarkar",
    "Fardin Ahmed Sheikh",
    "Fardin Hasan Rahman",
    "Fardin Hossain Khan",
    "Firozul Islam Ahmed",
    "Firozul Rahman Khan",
    "Foysal Ahmed Sarkar",
    "Foysal Ahmed Sarker",
    "Foysal Ahmed Sheikh",
    "Foysal Hossain Khan",
    "Foysal Khan Hossain",
    "Golam Mostafa Ahmed",
    "Golam Rabbani Uddin",
    "Habib Hossain Hasan",
    "Habibur Rahman Miah",
    "Helal Uddin Bhuiyan",
    "Hossain Abdul Ahmed",
    "Imran Ahmed Hossain",
    "Jahidul Abdur Ahmed",
    "Jobayer Uddin Hasan",
    "Junaid Abdul Rahman",
    "Junayed Hasan Ullah",
    "Kamrul Ibne Bhuiyan",
    "Mahadi Hasan Sheikh",
    "Mahfuj Hasan Sarkar",
    "Mahfuj Noor Hossain",
    "Mamunur Rashid Miah",
    "Mashrafi Abdur Khan",
    "Mizanur Noor Sarker",
    "Monir Hossain Islam",
    "Monirul Uddin Islam",
    "Mostafa Uddin Hasan",
    "Naimur Rahman Islam",
    "Nayon Hossain Ahmed",
    "Nazmul Hasan Sarkar",
    "Noman Ahmed Bhuiyan",
    "Noor Noor Chowdhury",
    "Noyon Abdur Bhuiyan",
    "Nurul Islam Hossain",
    "Rafiul Islam Sarkar",
    "Rafiul Islam Sarker",
    "Raihan Rahman Islam",
    "Rashid Abdur Sarkar",
    "Rashid Islam Sarker",
    "Rashidul Hasan Khan",
    "Rayan Hasan Hossain",
    "Ridoy Uddin Hossain",
    "Riyazul Islam Uddin",
    "Riyazul Rahman Khan",
    "Rohim Abdul Bhuiyan",
    "Ronny Hossain Uddin",
    "Rubel Hossain Ahmed",
    "Rubel Hossain Uddin",
    "Rudra Rahman Sheikh",
    "Ruhul Quddus Sarkar",
    "Sadiq Uddin Bhuiyan",
    "Sadiqur Rahman Miah",
    "Shafiqur Islam Khan",
    "Shafiul Alam Sarker",
    "Shafiul Islam Hasan",
    "Shafiul Islam Uddin",
    "Shahidul Hasan Khan",
    "Shahriar Hasan Khan",
    "Shakib Abdur Rahman",
    "Shakib Hasan Sarkar",
    "Shakil Abdur Sheikh",
    "Shami Abdur Hossain",
    "Shamim Hasan Sarkar",
    "Shamim Hasan Sarker",
    "Shamim Hossain Khan",
    "Shanto Hasan Sarker",
    "Shihab Uddin Rahman",
    "Shohel Ahmed Sarker",
    "Shuvo Hossain Ahmed",
    "Shuvo Hossain Hasan",
    "Shuvo Hossain Islam",
    "Shuvo Rahman Sheikh",
    "Sourov Hossain Miah",
    "Sumon Hasan Hossain",
    "Tanjim Abdul Sheikh",
    "Tanvir Ahmed Sarkar",
    "Tanvir Ahmed Sarker",
    "Tarek Hasan Bhuiyan",
    "Zakir Hasan Bhuiyan",
    "Zakir Hossain Uddin",
    "Ziaur Rahman Sarkar",
    "Abdullah Abdur Uddin",
    "Abdullah Nurul Uddin",
    "Akib Hasan Chowdhury",
    "Aminul Islam Bhuiyan",
    "Anik Chowdhury Hasan",
    "Anik Chowdhury Islam",
    "Anwar Hossain Sarker",
    "Azharul Islam Sarkar",
    "Azharul Islam Sarker",
    "Biplob Islam Bhuiyan",
    "Delwar Hossain Hasan",
    "Delwar Hossain Ullah",
    "Dipankar Ahmed Ullah",
    "Fardin Ahmed Bhuiyan",
    "Farhan Hasan Bhuiyan",
    "Firozul Islam Sheikh",
    "Foysal Hossain Ahmed",
    "Habibur Rahman Hasan",
    "Habibur Rahman Uddin",
    "Hossain Ahmed Rahman",
    "Jahidul Hasan Sheikh",
    "Jahidul Islam Sarkar",
    "Jubair Hasan Hossain",
    "Jubayer Noor Bhuiyan",
    "Junaid Hossain Ahmed",
    "Kamal Hossain Sarkar",
    "Karim Hossain Sheikh",
    "Mahadi Hasan Hossain",
    "Mahadi Hossain Islam",
    "Mahfuj Hasan Bhuiyan",
    "Mahfuj Hasan Hossain",
    "Mahfuz Rahman Sheikh",
    "Mahfuzul Islam Ullah",
    "Mahfuzul Uddin Islam",
    "Mizan Hossain Rahman",
    "Mizanur Abdul Sarkar",
    "Mizanur Rahman Ahmed",
    "Monir Hossain Sarkar",
    "Monir Hossain Sheikh",
    "Monirul Islam Rahman",
    "Monirul Islam Sarker",
    "Nafiz Ibne Chowdhury",
    "Naimur Rahman Sarker",
    "Nayon Hossain Sheikh",
    "Noor Uddin Chowdhury",
    "Nurul Hossain Sarkar",
    "Pavel Rahman Bhuiyan",
    "Rafiul Islam Bhuiyan",
    "Rafsan Ahmed Bhuiyan",
    "Raihanul Hasan Islam",
    "Raihanul Islam Ullah",
    "Raiyan Ahmed Hossain",
    "Rakibul Rahman Ahmed",
    "Rasel Hossain Rahman",
    "Rasel Hossain Sarkar",
    "Rashed Hossain Uddin",
    "Riyadul Ahmed Sheikh",
    "Riyadul Hasan Sarkar",
    "Riyadul Uddin Sarker",
    "Riyaz Hossain Sarkar",
    "Riyazul Hossain Khan",
    "Riyazul Islam Sarker",
    "Rohim Hossain Rahman",
    "Rubel Hossain Sheikh",
    "Sabbir Ahmed Bhuiyan",
    "Sabbir Hasan Bhuiyan",
    "Sabbir Hasan Hossain",
    "Sabbir Hossain Islam",
    "Sadiqur Abdul Rahman",
    "Shafiq Islam Hossain",
    "Shafiqul Islam Ahmed",
    "Shafiqul Islam Ullah",
    "Shafiul Islam Rahman",
    "Shahid Ahmed Hossain",
    "Shakil Uddin Hossain",
    "Shamim Ahmed Bhuiyan",
    "Shamim Ahmed Hossain",
    "Shamim Hasan Bhuiyan",
    "Shanto Hasan Bhuiyan",
    "Shawon Hasan Hossain",
    "Shihab Hasan Hossain",
    "Shuvo Hossain Sarkar",
    "Tafsir Uddin Bhuiyan",
    "Tanim Rahman Bhuiyan",
    "Tanjil Uddin Bhuiyan",
    "Tanjil Uddin Hossain",
    "Tanvir Ahmed Hossain",
    "Tanvir Hasan Hossain",
    "Zahid Hossain Rahman",
    "Zubair Hossain Hasan",
    "Abdul Karim Chowdhury",
    "Ameer Hossain Bhuiyan",
    "Anik Chowdhury Sarkar",
    "Debashish Ahmed Islam",
    "Faisal Hossain Rahman",
    "Fardin Hossain Sheikh",
    "Foysal Hossain Sarkar",
    "Foysal Hossain Sheikh",
    "Foysal Khan Chowdhury",
    "Golam Mostafa Bhuiyan",
    "Golam Mostafa Hossain",
    "Habibur Rahman Sarkar",
    "Habibur Rahman Sheikh",
    "Hridoy Hossain Sarker",
    "Imran Islam Chowdhury",
    "Jubayer Hossain Ahmed",
    "Mahadi Noor Chowdhury",
    "Mahfuz Noor Chowdhury",
    "Mizanur Rahman Sarker",
    "Mizanur Rahman Sheikh",
    "Monirul Islam Hossain",
    "Mostaque Ahmed Rahman",
    "Munna Hasan Chowdhury",
    "Rafid Hasan Chowdhury",
    "Raihanul Islam Sarkar",
    "Rakib Hasan Chowdhury",
    "Rasel Ahmed Chowdhury",
    "Rasel Hossain Bhuiyan",
    "Rashed Noor Chowdhury",
    "Rashedul Islam Rahman",
    "Rashedul Islam Sarkar",
    "Rashidul Hasan Rahman",
    "Rayan Ahmed Chowdhury",
    "Rayan Hasan Chowdhury",
    "Riyadul Hasan Hossain",
    "Riyazul Islam Hossain",
    "Rubel Hossain Bhuiyan",
    "Ruhul Islam Chowdhury",
    "Sabbir Hossain Rahman",
    "Sabbir Hossain Sheikh",
    "Sajib Uddin Chowdhury",
    "Shafiqul Hossain Khan",
    "Shafiqur Rahman Islam",
    "Shahidul Uddin Sarkar",
    "Shihab Hossain Rahman",
    "Shuvo Hossain Bhuiyan",
    "Sohan Abdur Chowdhury",
    "Tafsirul Ahmed Sarker",
    "Tariqul Hossain Uddin",
    "Zubair Hossain Rahman",
    "Anik Chowdhury Bhuiyan",
    "Debashish Abdur Sarker",
    "Debashish Abdur Sheikh",
    "Debashish Hossain Khan",
    "Firozul Noor Chowdhury",
    "Foysal Ahmed Chowdhury",
    "Foysal Hossain Bhuiyan",
    "Habibur Hossain Sheikh",
    "Kamrul Abdur Chowdhury",
    "Kamrul Islam Chowdhury",
    "Mahfuz Islam Chowdhury",
    "Mahfuzul Ahmed Bhuiyan",
    "Mahmud Islam Chowdhury",
    "Mamun Rahman Chowdhury",
    "Mizanur Rahman Hossain",
    "Monirul Hossain Sarker",
    "Nazmul Hasan Chowdhury",
    "Rafsan Hasan Chowdhury",
    "Rashedul Islam Bhuiyan",
    "Rashedul Rahman Sheikh",
    "Rayhan Ahmed Chowdhury",
    "Sabbir Ahmed Chowdhury",
    "Shafiqur Islam Hossain",
    "Shafiqur Rahman Sarker",
    "Shanto Hasan Chowdhury",
    "Tafsirul Islam Hossain",
    "Anwar Hossain Chowdhury",
    "Azhar Hossain Chowdhury",
    "Azharul Islam Chowdhury",
    "Bijoy Hossain Chowdhury",
    "Debashish Rahman Sarkar",
    "Jahidul Ahmed Chowdhury",
    "Rafsan Rahman Chowdhury",
    "Rasel Hossain Chowdhury",
    "Riyadul Hasan Chowdhury",
    "Riyazul Islam Chowdhury",
    "Shafiqur Rahman Hossain",
    "Tafsir Rahman Chowdhury",
    "Atikul Hossain Chowdhury",
    "Delwar Hossain Chowdhury",
    "Mizanur Rahman Chowdhury",
    "Sadiqur Rahman Chowdhury",
    "Shakib Hossain Chowdhury",
    "Shafiqur Rahman Chowdhury"],
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
