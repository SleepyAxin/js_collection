const info = 
{
    firstname: 'John',
    lastname: 'Doe',
    age: 30,
};

observe(info);

const doms = 
{
    firstname: document.querySelector('.firstname'),
    lastname: document.querySelector('.lastname'),
    age: document.querySelector('.age'),
};

function setFirstname()
{
    doms.firstname.textContent = '姓：' + info.firstname;
}

function setLastname()
{
    doms.lastname.textContent ='名：' + info.lastname;
}

function setAge()
{
    doms.age.textContent = '年龄：' + info.age;
}

autoRun(setFirstname);
autoRun(setLastname);
autoRun(setAge);