/**
 * 单件商品的数据
 */
class UIGoods
{
    /**
     * @param {Object} goods 商品
     */
    constructor(goods)
    {
        // 商品数据
        this.data = goods;
        // 选择的商品数量
        this.choose = 0;
    }

    /**
     * 选择商品的总价
     * @return {Number} 商品总价
     */
    totalPrice() { return this.data.price * this.choose; };

    /**
     * 是否选择了商品
     * @return {Boolean} 是否选择了商品
     */
    isChoose() { return this.choose > 0; };

    /**
     * 增加所选商品数量
     */
    increase() { this.choose++; };

    /**
     * 减少所选商品数量
     */
    decrease() { this.choose === 0 ? 0 : this.choose--; };
}

/**
 * 整个界面的数据
 */
class ui_data
{
    constructor()
    {
        const ui_goods = [];

        for (let i = 0; i < goods.length; i++) { ui_goods.push(new UIGoods(goods[i])); }

        // 所有商品
        this.ui_goods = ui_goods;
        // 配送起步价
        this.delivery_threshold = 30;
        // 配送费
        this.delivery_price = 5;
    }

    /**
     * 所有商品的总价
     * @return {Number} 所有商品的总价
     */
    totalPrice()
    {
        let total = 0;

        for (let i = 0; i < this.ui_goods.length; i++) { total += this.ui_goods[i].totalPrice(); }

        return total;
    }

    /**
     * 增加商品数量
     * @param {Number} index 商品索引
     */
    increase(index) { this.ui_goods[index].increase(); }

    /**
     * 减少商品数量
     * @param {Number} index 商品索引
     */
    decrease(index) { this.ui_goods[index].decrease(); }

    /**
     * 获取商品总选择数量
     * @return {Number} 商品总选择数量
     */
    totalChooseNumber()
    {
        let total = 0;

        for (let i = 0; i < this.ui_goods.length; i++) { total += this.ui_goods[i].choose; }

        return total;
    }

    /**
     * @return {Boolean} 是否有商品在购物车中
     */
    hasGoodsinCart() { return this.totalChooseNumber() > 0; }

    /**
     * @returns {Boolean} 是否达到配送起步价
     */
    isReachDeliveryThreshold() { return this.totalPrice() >= this.delivery_threshold; }

    /**
     * 该索引商品是否被选择
     * @param {Number} index 商品索引
     * @returns {Boolean} 是否被选择
     */
    isChoose(index) { return this.ui_goods[index].isChoose(); }
}

/**
 * 界面
 */
class UI
{
    constructor()
    {
        this.ui_data = new ui_data();
        // 所有 dom 元素
        this.doms = 
        {
            goods_container: document.querySelector('.goods-list'),
            delivery_price: document.querySelector('.footer-car-tip'),
            footer_pay: document.querySelector('.footer-pay'),
            footer_pay_inner_span: document.querySelector('.footer-pay span'),
            total_price: document.querySelector('.footer-car-total'),
            car: document.querySelector('.footer-car'),
            badge: document.querySelector('.footer-car-badge')
        };

        // 购物车
        const car_rect = this.doms.car.getBoundingClientRect();

        this.jump_target = 
        {
            x: car_rect.left + car_rect.width / 2,
            y: car_rect.top + car_rect.height / 5
        };

        this.createHTML();
        this.updateFooter();
        this.listenEvent();
    }

    /**
     * 监听各种事件
     */
    listenEvent()
    {
        this.doms.car.addEventListener('animationend', 
            function () { this.classList.remove('animate'); });
    }

    /**
     * 根据商品数据创建商品列表元素
     */
    createHTML() 
    {
        let html = '';

        for (let i = 0; i < this.ui_data.ui_goods.length; i++) 
        {
            let g = this.ui_data.ui_goods[i];

            html += 
            `<div class="goods-item">
                <img src="${g.data.pic}" alt="" class="goods-pic">
                <div class="goods-info">
                    <h2 class="goods-title">${g.data.title}</h2>
                    <p class="goods-desc">${g.data.desc}</p>
                    <p class="goods-sell">
                        <span>月售 ${g.data.sell_number}</span>
                        <span>好评率${g.data.favor_rate}%</span>
                    </p>
                    <div class="goods-confirm">
                        <p class="goods-price">
                            <span class="goods-price-unit">￥</span>
                            <span>${g.data.price}</span>
                        </p>
                        <div class="goods-btns">
                            <i index="${i}" class="iconfont i-jianhao"></i>
                            <span>${g.choose}</span>
                            <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        this.doms.goods_container.innerHTML = html;
    }

    /**
     * 增加商品数量
     * @param {Number} index 商品索引
     */
    increase(index)
    {
        this.ui_data.increase(index);
        this.updateGoodsItem(index);
        this.updateFooter();
        this.jump(index);
    }

    /**
     * 减少商品数量
     * @param {Number} index 商品索引
     */
    decrease(index)
    {
        this.ui_data.decrease(index);
        this.updateGoodsItem(index);
        this.updateFooter();
    }

    /**
     * 更新商品信息
     * @param {Number} index 商品索引
     */
    updateGoodsItem(index)
    {
        const goods_dom = this.doms.goods_container.children[index];

        this.ui_data.isChoose(index) 
        ? goods_dom.classList.add('active') : goods_dom.classList.remove('active');

        const span = goods_dom.querySelector('.goods-btns span');
        span.textContent = this.ui_data.ui_goods[index].choose;
    }

    /**
     * 更新底部信息
     */
    updateFooter()
    {
        // 得到总价数据
        const total = this.ui_data.totalPrice();
        // 设置配送费
        this.doms.delivery_price.textContent = `配送费￥${this.ui_data.delivery_price}`;
        // 设置起送费还差多少
        if (this.ui_data.isReachDeliveryThreshold()) 
        {
            // 到达起送点
            this.doms.footer_pay.classList.add('active');
        } 
        else 
        {
            this.doms.footer_pay.classList.remove('active');

            // 更新还差多少钱
            const dis = Math.round(this.ui_data.delivery_threshold - total);
            this.doms.footer_pay_inner_span.textContent = `还差￥${dis}元起送`;
        }

        // 设置总价
        this.doms.total_price.textContent = total.toFixed(2);

        // 设置购物车的样式状态
        this.ui_data.hasGoodsinCart ()
        ? this.doms.car.classList.add('active') : this.doms.car.classList.remove('active');
        
        // 设置购物车中的数量
        this.doms.badge.textContent = this.ui_data.totalChooseNumber();
    }

    /**
     * 购物车动画
     */
    carAnimate() { this.doms.car.classList.add('animate'); }

    /**
     * 抛物线跳跃的元素
     * @param {Number} index 商品索引
     */
    jump(index)
    {
        // 找到对应商品的加号
        const btnAdd = this.doms.goods_container.children[index].querySelector('.i-jiajianzujianjiahao');
        const rect = btnAdd.getBoundingClientRect();
        const start = { x: rect.right, y: rect.top };

        // 跳吧
        const div = document.createElement('div');
        div.className = 'add-to-car';
        const i = document.createElement('i');
        i.className = 'iconfont i-jiajianzujianjiahao';

        // 设置初始位置
        div.style.transform = `translateX(${start.x}px)`;
        i.style.transform = `translateY(${start.y}px)`;
        div.appendChild(i);
        document.body.appendChild(div);

        // 强行渲染
        div.clientWidth;
    
        // 设置结束位置
        div.style.transform = `translateX(${this.jump_target.x}px)`;
        i.style.transform = `translateY(${this.jump_target.y}px)`;

        const that = this;
        div.addEventListener
        (
            'transitionend',
            function() { div.remove(); that.carAnimate(); },
            // 事件仅触发一次
            { once: true }
        );
    }
}

const ui = new UI();

// 注册监听事件
ui.doms.goods_container.addEventListener
(
    'click',
    function(e)
    {
        if (e.target.classList.contains('i-jiajianzujianjiahao')) 
        {
            const index = +e.target.getAttribute('index');
            ui.increase(index);
        } 
        else if (e.target.classList.contains('i-jianhao')) 
        {
            const index = +e.target.getAttribute('index');
            ui.decrease(index);
        }
    }
);

window.addEventListener
(
    'keypress',
    function(e)
    {
        if (e.code === 'Equal') { ui.increase(0); } 
        else if (e.code === 'Minus') { ui.decrease(0); }
    }
);