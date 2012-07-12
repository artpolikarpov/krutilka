/*
 Krutilka (Spinner) Jquery Plugin, v 0.1
 Author: Artem Polikarpov | http://artpolikarpov.ru/
 */

(function ($) {
  var ns = 'http://www.w3.org/2000/svg';
  var svgTest = function() {
    // Поддерживается ли СВГ
    var div = document.createElement('div');
    div.innerHTML = '<svg/>';
    return (div.firstChild && div.firstChild.namespaceURI) == ns;
  };

  var svgFLAG = svgTest();

  var makeSVG = function (tag, attrs) {
    var el= document.createElementNS(ns, tag);
    for (var k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  };

  var krutilka = function (el, options) {
    el.data('initialized', true);

    var svg = $(makeSVG('svg', {width: options.size, height: options.size, style: 'background: '+ options.background +''})).appendTo(el);
    var g = makeSVG('g', {fill: 'none', stroke: options.color, 'stroke-width': options.petalWidth});
    var $g = $(g).appendTo(svg);

    var x = options.size / 2;
    var y = options.size / 2;

    // Строим крутилку
    for (var _i = 0; _i < options.petals; _i++) {
      // Угол в градусах
      var a = 360 / options.petals * (options.petals - _i);
      // Прозрачность
      var opacity = Math.max(1 - 1 / options.petals * _i, .25);
      // Создаём линию
      $(makeSVG('line', {x1: options.size / 2, y1: options.petalOffset, x2: options.size / 2, y2: options.petalOffset + options.petalLength, transform: 'rotate('+ a + ' ' + x + ' ' + y + ')', opacity: opacity})).appendTo($g);
    }

    // Крутим крутилку
    var frame = 0;
    var animationInterval;
    var animation = function () {
      var a = 360 / options.petals * frame;
      g.setAttribute('transform', 'rotate('+ a + ' ' + x + ' ' + y + ')');

      frame++;
      if (frame >= options.petals) {
        frame = 0;
      }
    };

    el.bind('show', function(e, time){
      // Показываем и запускаем крутилку
      el.stop().fadeTo('fast', 1);
      clearInterval(animationInterval);
      animation();
      animationInterval = setInterval(animation, (time ? time : options.time) / options.petals);
    });

    el.bind('hide', function(){
      // Скрываем и останавливаем крутилку
      el.stop().fadeTo('fast', 0, function(){
        clearInterval(animationInterval);
      });
    });

    el.trigger('show');
  };

  $.fn.krutilka = function (o) {
    var options = {
      size: 32, // Ширина и высота блока с крутилкой
      petals: 15, // Сколько лепестков у крутилки
      petalWidth: 2, // Толщина лепестка
      petalLength: 8, // Длина лепестка
      petalOffset: 1, // Внутреннее поле блока с крутилкой (расстояние до кончика лепестка)
      time: 1000, // Время прохода круга в миллисекундах
      color: '#808080', // Цвет лепестков
      background: 'none' // Фон крутилки
    };

    $.extend(options, o);

    this.each(function () {
      var el = $(this);
      if (!el.data('initialized') && svgFLAG) {
        // Если ещё не инициализировано
        krutilka(el, options);
      }
    });

    // Чейнабилити
    return this;
  };
})(jQuery);