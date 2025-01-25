
/**
 * 观测某个对象的所有属性
 * @param {Object} obj 要观测的对象
 */
function observe(obj)
{
    for (const key in obj)
    {
        let internal_value = obj[key];
        const dep_funcs = [];

        Object.defineProperty(obj, key, 
        {
            get() 
            { 
                // 依赖收集：得到用到该值的函数
                if (window.__func && !dep_funcs.includes(window.__func))
                {
                    dep_funcs.push(window.__func);
                }

                return internal_value; 
            },
            set(value) 
            {
                internal_value = value;
                // 派发更新：调用用到该值的函数
                for (let i = 0; i < dep_funcs.length; i++)
                {
                    dep_funcs[i]();
                }
            }
        });
    }
}

/**
 * 自动运行用到响应式数据的函数
 * @param {Function} func 传入函数
 */
function autoRun(func)
{
    window.__func = func;
    func();
    window.__func = null;
}