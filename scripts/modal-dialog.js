/**
 * Modal Dialog JavaScript Library
 * @author 						C
 * @date    					2017-11-06
 * @param  {window} 	global
 * @param  {jQuery} 	$
 * @param  {function} 	factory
 * @return {void}
 * @version 1.0.0
 */
(function(window, $, factory) {

	window.Dialog = factory(window, $);

})(window, jQuery, function(window, $) {

	var windowWidth;
	var windowHeight;

	/**
	 * 构建一个新的Dialog
	 * @param {Object} options 参数
	 */
	function Dialog(options) {
		return new Dialog.prototype._init($('body'), options);
	}

	/**
	 * 初始化函数
	 * @return {Dialog} Dialog对象
	 */
	const init = Dialog.prototype._init = function($target, options) {

		this.version = '1.0.0';

		this.$target = $target;

		this.set = $.extend(true, {}, this.set, options);

		// 构建Dialog
		this._build();

		// 默认没有初始化过
		this._init = false;

		if(this.set.defaultApply) { // 如果是自动显示
			// 显示
			this.apply();
		}

	}

	/**
	 * 构建Dialog
	 * @author  sin.
	 * @date    2017-11-06 23:11
	 * @return {void}
	 */
	Dialog.prototype._build = function() {

		// <!-- 遮罩层 -->
		// <div class="modal-mask">
		// 	<div class="modal-dialog">
		// 		<!-- 关闭 -->
		// 		<a href="javascript:;" class="close"><span>×</span></a>
		// 		<div class="dialog-head">标题</div>
		// 		<div class="dialog-body">内容</div>
		// 		<div class="dialog-footer">
		// 			<a href="javascript:;" class="button">确定</a>
		// 			<a href="javascript:;" class="button">取消</a>
		// 		</div>
		// 	</div>
		// </div>

		// Dialog分支
		this.$modalMask = $(`<div class="modal-mask"></div>`);

		this.$modalDialog = $(`<div class="modal-dialog"></div>`);

		this.$close = $(`<a href="javascript:;" class="close"><span>×</span></a>`);

		this.$head = $(`<div class="dialog-head"></div>`);

		this.$body = $(`<div class="dialog-body"></div>`);

		this.$footer = $(`<div class="dialog-footer"></div>`);

		this.$button = $(`<a href="javascript:;" class="button"></a>`);

		// 如果zIndex小于等于0, 那么久重新计算合适的zIndex
		if(this.set.zIndex <= 0) {
			this.set.zIndex = (this.$target.siblings().length-1 || this.$target.children().siblings().length) + 10001;
		}

		// 开始构建Dialog
		this._buildMask();

		this._buildDialog();

		this._buildClose();

		this._buildHead();

		this._buildBody();

		this._buildFooter();

	}

	/**
	 * 构建遮罩层
	 * @return {void}
	 */
	Dialog.prototype._buildMask = function() {

		if(!this.set.mask) { // 不使用遮罩层
			this.$modalMask.css({
				position: 	'absolute',
				top: 		'-200%',
			});
			return ;
		}

		// 设置样式
		this.$modalMask.css({
			backgroundColor: 	this.set.maskBgColor,
			zIndex: 			this.set.zIndex,
		});

		// 增加额外的class
		this.$modalMask.addClass(this.set.maskClassName);

	}

	/**
	 * 构建Dialog
	 * @return {void}
	 */
	Dialog.prototype._buildDialog = function() {

		// 设置样式
		this.$modalDialog.css({
			width: 				this.set.dialogWidth,
			height: 			this.set.dialogHeight,
			border: 			this.set.dialogBorder,
			backgroundColor: 	this.set.dialogBgColor,
			borderRadius: 		this.set.dialogBorderRadius,
			padding: 			this.set.dialogPadding,
		});

		// 为dialog添加额外的calss值
		this.$modalDialog.addClass(this.set.dialogClassName);

		// 将dialog添加到遮罩层(mask)中
		this.$modalMask.append(this.$modalDialog);

	}

	/**
	 * 构造Close按钮
	 * @return {void}
	 */
	Dialog.prototype._buildClose = function() {

		if(!this.set.close)  {// 不需要关闭按钮
			return ;
		}

		// 设置样式
		this.$close.css({
			fontSize: 	this.set.closeFontSize,
			top: 		this.set.closePositionTop,
		});

		// 设置position属性值
		if(this.set.closePositionLeft === false) {
			this.$close.css({
				right: 	this.set.closePositionRight,
			});
		} else {
			this.$close.css({
				left: 	this.set.closePositionLeft,
			});
		}

		// 增加额外的class
		this.$close.addClass(this.set.closeClassName);

		// 监听事件
		// this.$close.click(() => {
		// 	this.set.event.close();
		// 	this.out();
		// });

		// 监听事件
		var self = this;
		this.$close.click(function() {
			self.set.event.close();
			self.out();
		});

		// 将close button添加到dialog中
		this.$modalDialog.append(this.$close);

	}

	/**
	 * 构造Head
	 * @return {void}
	 */
	Dialog.prototype._buildHead = function() {

		if(!this.set.head) { // 不需要head
			return ;
		}

		// 如果lineHeight小于等于0, 那么就计算合适的lineHeight值
		if(this.set.headLineHeight <= 0) {
			this.set.headLineHeight = (parseInt(this.set.headHeight) * 2 - parseInt(this.set.fontSize)) + 'px';
		}

		// 设置样式
		this.$head.css({
			fontSize: 	this.set.fontSize,
			color: 		this.set.fontColor,
			fontWeight: this.set.fontWeight,
			textAlign:  this.set.textAlign,

			padding: 	this.set.headPadding,
			width: 		this.set.headWidth,
			height: 	this.set.headHeight,
			lineHeight: this.set.headLineHeight,
		});

		// 添加title
		this.$head.html(this.set.title);

		// 添加额外的class
		this.$head.addClass(this.set.headClassName);

		// 将head添加到dialog中
		this.$modalDialog.append(this.$head);
	}

	/**
	 * 构造Body
	 * @return {void}
	 */
	Dialog.prototype._buildBody = function() {

		if(!this.set.body) { // 不需要body
			return ;
		}

		// 设置样式
		this.$body.css({
			padding: 	this.set.bodyPadding,
			fontSize: 	this.set.bodyFontSize,
			lineHeight: this.set.bodyLineHeight,
			color: 		this.set.bodyTextColor,
			textAlign:  this.set.bodyTextAlign,
		});

		// 设置内容
		this.$body.html(this.set.bodyContent);

		// 增加额外的class
		this.$body.addClass(this.set.bodyClassName);

		// 将$body添加到dialog中
		this.$modalDialog.append(this.$body);

	}

	/**
	 * 构造Footer
	 * @return {void}
	 */
	Dialog.prototype._buildFooter = function() {

		this.$footer = $(`<div class="dialog-footer"></div>`);

		this.$button = $(`<a href="javascript:;" class="button"></a>`);

		if(!this.set.footer) { // 不需要footer
			return ;
		}

		// 设置样式
		this.$footer.css({
			padding: 		this.set.footerPadding,
		});

		// 设置button的样式
		this.$button.css({
			lineHeight: 	this.set.buttonLineHeight,
			fontSize: 		this.set.buttonFontSize,
			marginRight: 	this.set.buttonMargin,
			padding: 		this.set.buttonPadding,
		});

		// 为button增加额外的class
		this.$button.addClass(this.set.buttonClassName);

		if(this.set.confirm) { // 确认按钮
			var $confirmButton = this.$button.clone().text(this.set.confirmText);
			// 监听事件
			// $confirmButton.click(() => {
			// 	this.set.event.confirm();
			// 	this.out();
			// });
			// 监听事件
			var self = this;
			$confirmButton.click(function() {
				self.set.event.confirm();
				self.out();
			});
			// 添加确认按钮
			this.$footer.append($confirmButton);
		}

		if(this.set.cancel) { // 取消按钮
			var $cancelButton = this.$button.clone().css({ margin: 0 }).text(this.set.cancelText);
			// 监听事件
			// $cancelButton.click(() => {
			// 	this.set.event.cancel();
			// 	this.out();
			// });
			// 监听事件
			var self = this;
			$cancelButton.click(function() {
				self.set.event.cancel();
				self.out();
			});
			// 添加取消按钮
			this.$footer.append($cancelButton);
		}

		// 为footer增加额外的class
		this.$footer.addClass(this.set.footerClassName);

		// 将footer添加到dialog中
		this.$modalDialog.append(this.$footer);
	}

	/**
	 * 定位
	 * @return {void}
	 */
	Dialog.prototype._position = function() {

		windowWidth = $(window).width();
		windowHeight = $(window).height();

		var dialogWidth = this.$modalDialog.outerWidth();
		var dialogHeight = this.$modalDialog.outerHeight();

		var x1 = windowWidth >>> 1;
		var x2 = dialogWidth >>> 1;
		var left = x1 - x2;

		var y1 = windowHeight >>> 1;
		var y2 = dialogHeight >>> 1;
		var top = y1 - y2;

		this.$modalDialog.css({ top, left });

	}

	/**
	 * 初始化Dialog
	 * @return {void}
	 */
	Dialog.prototype._initDialog = function() {

		// 已经初始化过了不需要再次初始化
		if(this._init) {
			return ;
		}

		// 添加到页面中
		this.$target.append(this.$modalMask);

		// 定位
		this._position();

		// $(window).resize(() => {
		// 	windowWidth = $(window).width();
		// 	windowHeight = $(window).height();
		// 	this._position();
		// });

		var self = this;

		$(window).resize(function() {
			windowWidth = $(window).width();
			windowHeight = $(window).height();
			self._position();
		});

		this._init = true;
	}

	/**
	 * 入屏过度动画
	 * @return {void}
	 */
	Dialog.prototype._transitionAnimationIn = function() {

		this.$modalMask.addClass(this.set.maskAnimationIn);

		this.$modalDialog.addClass(this.set.dialogAnimationIn);

	}

	/**
	 * 出屏过度动画
	 * @return {void}
	 */
	Dialog.prototype._transitionAnimationOut = function() {

		this.$modalMask.removeClass(this.set.maskAnimationIn).addClass(this.set.maskAnimationOut);

		this.$modalDialog.removeClass(this.set.dialogAnimationIn).addClass(this.set.dialogAnimationOut);

	}

	/**
	 * 显示(应用Dialog)
	 * @return {void}
	 */
	Dialog.prototype.apply = function() {

		if(!this.set.animation) { // 无过度动画
			this.$modalMask.css({ display: 'block' });
		} else {
			// 入屏动画
			this._transitionAnimationIn();
		}

		// 如果没有初始化过
		if(!this._init) {
			this._initDialog();
		}
	}

	/**
	 * 隐藏(出屏)
	 */
	Dialog.prototype.out = function() {

		if(!this.set.animation) { // 无过度动画
			// this.$modalMask.css({ display: 'none' });
			this.$modalMask.remove();
		} else {
			// 清楚定时器
			this._timer && clearTimeout(this._timer);

			// 出屏动画
			this._transitionAnimationOut();

			// this._timer = setTimeout(() => {
			// 	this.$modalMask.remove();
			// }, this.set.animationDuration);

			var self = this;

			this._timer = setTimeout(function() {
				self.$modalMask.remove();
			}, this.set.animationDuration);
		}

	}

	/**
	 * 默认参数
	 * @type {Object}
	 */
	Dialog.prototype.set = {

		mask: 					true,						// 遮罩层
		maskBgColor: 			'rgba(43, 46, 56, .9)',		// 遮罩层背景颜色
		maskClassName: 			undefined,					// 遮罩层额外的class
		maskAniamtionIn: 		'animated fadeIn',			// 遮罩层入屏动画
		maskAnimationOut: 		'animated fadeOut',			// 遮罩层出屏动画

		dialogWidth: 			'auto',						// dialog宽度
		dialogHeight: 			'auto',						// dialog高度
		dialogBorder: 			'none',						// dialog边框
		dialogPadding: 			'0px 200px',				// dialog内边距
		dialogBgColor: 			'#FFF',						// dialog背景颜色
		dialogClassName: 		undefined,					// dialog额外的class
		dialogBorderRadius: 	0,							// dialog borderRadius
		dialogAnimationIn: 		'animated scaleFadeIn',		// dialog入屏动画
		dialogAnimationOut: 	'animated scaleFadeOut',	// dialog出屏动画

		close: 					true,						// 关闭按钮
		closePositionTop: 		8,							// 关闭按钮top值
		closePositionLeft: 		15,							// 关闭按钮left值. (当left值等于false时, 使用right)
		closePositionRight: 	0,							// 关闭按钮right值.
		closeFontSize: 			18,							// 关闭按钮的大小. (关闭按钮是一个字符, 所以设置的是fontSize)
		closeClassName: 		undefined,					// 关闭按钮额外的class

		head: 					true,						// head显示
		title: 					'',							// head标题
		fontSize: 				20,							// 标题字体大小
		fontColor: 				'#333',						// 标题字体颜色
		fontWeight: 			'bold',						// 标题字体Weight值
		textAlign: 				'center',					// head(标题)文本居中模式.
		headClassName: 			undefined,					// head额外的class
		headPadding: 			'0 0 15px 0',				// head内边距
		headWidth: 				'100%',						// head宽度
		headHeight: 			'60px',						// head高度
		headLineHeight: 		0,							// head行间距. 小于等于0, 表示动态指定.(一直在最底部)

		body: 					true,						// body显示
		bodyPadding: 			'15px 20px',				// body内边距
    	bodyFontSize: 			14,							// body字体大小
    	bodyLineHeight: 		1.5,						// body行间距
    	bodyContent: 			'',							// body内容
    	bodyTextColor: 			'#919498',					// body文字颜色
    	bodyTextAlign: 			'center',					// body文本居中模式
    	bodyClassName: 			undefined,					// body额外的class值

    	footer: 				true,						// footer显示
    	footerPadding: 			'15px 0 20px 0',			// footer内边距
    	buttonLineHeight:  		'43px',						// 按钮行高
    	buttonFontSize: 		14,							// 按钮字体大小
    	buttonClassName: 		undefined,					// 按钮额外的class
    	buttonMargin: 			40,							// 按钮之间的间距
		buttonPadding: 			'0 41px',					// 按钮内边距
    	confirm: 				true,						// 确认按钮
    	cancel: 				true,						// 取消按钮
    	confirmText: 			'Okey',						// 确认按钮文字
    	cancelText: 			'Cancel',						// 取消按钮文字
    	footerClassName: 		undefined,					// footer额外的class

    	event: {
    		close: 		function() {},						// dialog关闭按钮点击事件
    		cancel: 	function() {},						// 取消按钮点击事件
    		confirm: 	function() {},						// 确认按钮点击事件
    	},

		zIndex: 				0,							// 最外围层级(mask). 如果小于等于0, 那么将会动态的设置合适的zIndex值
		// position: 			'fixed',					// 定位模式. dialog的定位
		animation: 				true,						// 是否显示过度动画
		defaultApply: 			true,						// 默认自动显示
		animationDuration: 		1000,						// 动画持续时间(单位:ms)
	};

	init.prototype = Dialog.prototype;

	return Dialog;

});
