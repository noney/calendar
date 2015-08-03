(function($){
	 /*---load date---*/
	 $.fn.initDate=function(options){
		var settings={
			 sdate:2000,
			 edate:2050
		};
		if(options)var opts=$.extend(settings,options);
		createElm.dateFrame(opts.parentid);
		_bindAttach(opts);//bind
		$(opts.target).empty();
		var _oneleft=createElm.dateViewArea(opts.sdate,opts.edate);
		var _oneRight=createElm.dateViewArea(opts.sdate,opts.edate);
		var $datearea=$('.date-area');
		$(opts.target).append(_oneleft);
		$(opts.target).append(_oneRight);

		var $oneLeftObj=$(_dtime.id.datecontrol.obj).find('table').eq(0);
		var $oneRightObj=$(_dtime.id.datecontrol.obj).find('table').eq(1);

		var $onePrev=$('a.prevMonth',$oneLeftObj);
		var $oneNext=$('a.nextMonth',$oneRightObj);

		var isIE6=(window.XMLHttpRequest?false:true);
		$onePrev.bind('click',function(){
			_exeAttach.onePrev($oneLeftObj,$oneRightObj,opts);
		});
		$oneNext.bind('click',function(){
			_exeAttach.oneNext($oneLeftObj,$oneRightObj,opts);
		});

		$(this).click(function(){
			var $this=$(this);
			_dtime.vars.signlen=2;
			$datearea.css({
				position:opts.pos,
				left:opts.posleft,
				top:opts.postop,
				zIndex:opts.zindex
			});
			if($('.date-area:hidden').length==1){
				$datearea.show();	
			}else{
				$datearea.hide();
				return false;
			}
			$oneLeftObj.find('a.nextMonth').hide();
			$oneRightObj.find('a.prevMonth').hide();

			$oneRightObj.css({left:190});
			$oneRightObj.find('h5[alt=readDate]').css({'padding-left':'20px'});

			_exeAttach.loadTd(opts);
			return false;
		});
	}
	/*---public json---*/
	 _dtime={
		'css':{
			'selected':'selected',
			'timesign':'timesign',
			'chosen':'chosen',
			'chosenn':'chosenn',
			'past':'past',
			'selectedblock':'selected-block',
			'noselectedblock':'no-selected-block',
			'altopt':'altopt',
			'over':'over',
			'weektip':'week-tip'
		},
		'id':{
			'loadWeek':{
				'name':'loadWeek',
				'obj':'#loadWeek'
			},
			'loadTime':{
				'name':'loadTime',
				'obj':'#loadTime'
			},
			'shortcut':{
				'name':'timeShortcut',
				'obj':'#timeShortcut'
			},
			'dateshowedit':{
				'name':'dateShowEdit',
				'obj':'#dateShowEdit'
			},
			'datecontrol':{
				'name':'date-control',
				'obj':'.date-control'
			}
		},
		'vars':{
			'weekUpper':{'0':'日','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六'},
			'signlen':2,
			'readDate':[]
		}
    },
	/*---create element---*/
	createElm={
		dateViewArea:function(_syear,_eyear){
			var table=[];
			var mselect=[];
			var yselect=[];
			yselect.push('<select name="year">');//year
            for (var i = 0; i <= _eyear - _syear; i++) yselect.push( '<option>' +parseInt(_syear+i) + '</option>');
			yselect.push('</select>');
			mselect.push('<select name="month">');//month
            for (var i=1;i<=12;i++) {var j=i-1;parseInt(i).lnegth==1?'0'+i:i;mselect.push('<option value="' + j + '">' + i + '</option>')};
            mselect.push('</select>');
			table.push('<table class="datepicker" cellpadding="0" cellspacing="0"><thead>');//table
			table.push('<tr class="controls"><th colspan="7"><p class="none">' + yselect.join('') + '&nbsp;' + mselect.join('') + '</p><span class="l-angel"></span><span class="top-center"><a href="javascript:void(0)" class="prevMonth"></a><h5 alt="readDate"></h5><a href="javascript:void(0)" class="nextMonth"></a></span><span class="r-angel"></span></th></tr>');
			table.push('<tr class="days"><th class="l-border">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="r-border">六</th></tr></thead><tbody>');
			for (var i = 0; i < 6; i++) {
                table.push('<tr><td class="l-border"></td><td></td><td></td><td></td><td></td><td></td><td class="r-border"></td></tr>');
            };
			table.push('</tbody></table>');
			return table.join('');
		},
		dateFrame:function(_this){
			var frame=[];
			frame.push('<div class="date-area">');
			frame.push('<div class="date-control"></div>');
			frame.push('<div class="date-line"></div>');
			frame.push('<div class="date-but"><a href="javascript:void(0)" class="btton_confirm" id="dateSubmit"><span>确认</span></a>&nbsp;&nbsp;<a href="javascript:void(0)" class="btton_reset" id="dateReset"><span>重 置</span></a></div>');
			$(_this).append(frame.join(''));
		}
	},
	/*---bind event---*/
	_bindAttach=function(opts){
		var $ds=$('#dateSubmit');
		var $dr=$('#dateReset');
		var $ts=$('#timeConfirm');
		var $daobj=$(".date-area");
		$ds.bind('click',function(){
			_exeAttach.ds(this,opts);
			return false;
		});
		$dr.bind('click',function(){
			_exeAttach.dr(opts);
			return false;
		});
		$ds.bind("mousedown",function(){
		   $(this).removeClass("btton_confirm");
		   $(this).addClass("clicks_four");
		});
		$ds.bind("mouseup",function(){
		   $(this).addClass("btton_confirm");
		   $(this).removeClass("clicks_four");
		});
		$dr.bind("mousedown",function(){
		   $(this).removeClass("btton_reset");
		   $(this).addClass("clicks_three");
		});
		$dr.bind("mouseup",function(){
		   $(this).addClass("btton_reset");
		   $(this).removeClass("clicks_three");
		});
		$(document).bind('click',function(e){
			e = window.event || e;
			var eld = e.srcElement || e.target;
			if($(eld).parents('div.date-area').length==0){
				if(!$(eld).hasClass('date-area')){
					if($('.date-area:hidden').length==0){
						$daobj.hide();
					}	
				}
			}
		});
	},
	/*---extecut event---*/
	_exeAttach={
		ds:function(_this,opts){
			var _start=_dtime.vars.readDate[0];
			if(_dtime.vars.readDate.length==1){
				$(opts.starget).text(_dtime.vars.readDate[0]+' - '+_dtime.vars.readDate[0]);
			}else{
				$(opts.starget).text(_dtime.vars.readDate[0]+' - '+_dtime.vars.readDate[1]);
			}
			opts.callback();
			$('.date-area').hide();
		},
		dr:function(opts){
			this.loadTd(opts);
			_dtime.vars.signlen=2;
		},
		onePrev:function($lObj,$rObj,opts){
			var _ly=$("select[name=year]",$lObj).val();
			var _lm=$("select[name=month]",$lObj).val();
			var _ry=$("select[name=year]",$rObj).val();
			var _rm=$("select[name=month]",$rObj).val();
			_lm--;_rm--;
			if(_lm==-1){_lm=11;_ly--}
			if(_rm==-1){_rm=11;_ry--}
			_loadMonth($lObj,opts,_dtime.vars.readDate,_ly,_lm);
			_loadMonth($rObj,opts,_dtime.vars.readDate,_ry,_rm);
		},
		oneNext:function($lObj,$rObj,opts){
			var _ly=$("select[name=year]",$lObj).val();
			var _lm=$("select[name=month]",$lObj).val();
			var _ry=$("select[name=year]",$rObj).val();
			var _rm=$("select[name=month]",$rObj).val();
			_lm++;_rm++;
			if(_lm==12){_lm=0;_ly++}
			if(_rm==12){_rm=0;_ry++}
			_loadMonth($lObj,opts,_dtime.vars.readDate,_ly,_lm);
			_loadMonth($rObj,opts,_dtime.vars.readDate,_ry,_rm);
		},
		loadTd:function(opts){
			if($(opts.starget).text()!=''){
				var $oneLeftObj=$(_dtime.id.datecontrol.obj).find('table').eq(0);
				var $oneRightObj=$(_dtime.id.datecontrol.obj).find('table').eq(1);

				var readDate=_dtime.vars.readDate=[];
				var readDate1=_dtime.vars.readDate1=[];
				readjson=$(opts.starget).text().split('-');
				readDate.push(readjson[0]);
				readDate.push(readjson[1]);

				var _onefirst=_returnymd(readDate[0]);
				var _onelast=_returnymd(readDate[1]);

				var _oneoy=_onefirst.m+1==12?_onefirst.y+1:_onefirst.y;
				var _oneom=_onefirst.m+1==12?0:_onefirst.m+1;

				_loadMonth($oneLeftObj,opts,readDate,_onefirst.y,_onefirst.m);
				_loadMonth($oneRightObj,opts,readDate,_oneoy,_oneom);
			}		
		}
	},
	/*---load month---*/
	_loadMonth=function(_obj,_opts,_readDate,_y,_m){
		var date=[];
		var _daystr=new Date(_y,2,0).getDate() == 29?'31,29,31,30,31,30,31,31,30,31,30,31'.split(','):'31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
		var _days=_daystr[_m];
		var _index=new Date(_y,_m,1).getDay();
		var _cells=$(_obj).find('td').removeClass('timesign');var _cells=$(_obj).find('td').removeClass('selected');var _cells=$(_obj).find('td').removeClass('altopt');
		var _cells=$(_obj).find('td').removeClass('past');var _cells=$(_obj).find('td').text('').removeAttr('alt').unbind('click').unbind('mouseenter mouseleave');
		$("select[name=month]", _obj).get(0).selectedIndex = _m;
		$("select[name=year]", _obj).get(0).selectedIndex = Math.max(0, _y - _opts.sdate);
		$("h5[alt=readDate]",_obj).text(_returnFormat(new Date(_y,_m,1),'/'));
		for(var i=0;i<_days;i++){
			var _cell = jQuery(_cells.get(i + _index));
			var _cur=_y+'/'+_returnTwo(_m*1+1)+'/'+_returnTwo(i+1);
			_cell.text(i+1).attr('alt',_cur);
			if((new Date(_y,_m,i+1).getTime()>new Date(_readDate[0]).getTime())&&(new Date(_y,_m,i+1).getTime()<new Date(_readDate[1]).getTime())){
					_cell.addClass(_dtime.css.selected);
			}
			if(new Date(_y,_m,i+1).getTime()==new Date(_readDate[0]).getTime()||new Date(_y,_m,i+1).getTime()==new Date(_readDate[1]).getTime()){
				_cell.addClass(_dtime.css.timesign);
			}
			if(new Date(_y,_m,i+1).getTime()>_returnTodayGetTime()){
				_cell.addClass(_dtime.css.past);
			}else{
				_cell.hover(function() {
					$(this).addClass(_dtime.css.over);
				},function() {
					$(this).removeClass(_dtime.css.over);
				}).click(function(e) {
					_tdclick(e,this);
					return false;
				});
			}
		}
	},
	/*---date format set---*/
	_cutsign=function(_obj,_cur,_sign){
		var formatReg=new RegExp(_cur,"g");
		var switchSign=_obj.replace(formatReg,_sign);
		return switchSign;
	},
	_returnymd=function(dobj){
		if(dobj.constructor != Date){
			dobj=new Date(dobj);
		}
		return {y:dobj.getFullYear(),m:dobj.getMonth(),d:dobj.getDate(),w:dobj.getDay()};
	},
	_returnGetTime=function(y,m,d){
		if(d){
			return new Date(y,m,d).getTime();
		}else{
			return new Date(y,m,1).getTime();
		}
	},
	_returnFormat=function(_date,_sign){
		if(_date.constructor != Date){
			_date=new Date(_date);
		}
		var _ymd=_date.getFullYear()+_sign+_returnTwo(_date.getMonth()+1)+_sign+_returnTwo(_date.getDate());
		return _ymd;
	},
	_returnTwo=function(_str){
		return String(_str).length==1?'0'+_str:_str;
	},
	_returnTodayGetTime=function(_str){
		var obj=new Date();
		return new Date(obj.getFullYear(),obj.getMonth(),obj.getDate()).getTime();
	},
	_returnDays=function(_o,_t){
		var differ=(new Date(_t).getTime()-new Date(_o).getTime())/24/60/60/1000+1;
		return differ;
	},
	/*---date per click---*/
    _tdclick=function(e,_this){
		var $alltd=$(_dtime.id.datecontrol.obj).find('table td');
		var $table=$(_dtime.id.datecontrol.obj).find('table');
		if(_dtime.vars.signlen==2){
			$alltd.removeClass(_dtime.css.selected);
			$alltd.removeClass(_dtime.css.timesign);
			$alltd.removeClass(_dtime.css.altopt);
			$(_this).addClass(_dtime.css.timesign);
			_dtime.vars.readDate=[];
			var _first=$(_this).attr('alt');
			_dtime.vars.readDate.push(_first);
			_dtime.vars.signlen=1;
		}else{
			var _last=$(_this).attr('alt');
			if(new Date(_dtime.vars.readDate[0]).getTime()>new Date(_last).getTime()){
				var cache=_dtime.vars.readDate.shift();
				_dtime.vars.readDate.push(_last);
				_dtime.vars.readDate.push(cache);
			}else{
				_dtime.vars.readDate.push(_last);
			}
			_dtime.vars.signlen=2;
			_tdSign($table,_dtime.vars.readDate[0],_dtime.vars.readDate[1]);
			$(_this).addClass(_dtime.css.timesign);
		}
	},
	/*---date per sign---*/
	_tdSign=function(_obj,_first,_last){
		var _days=_returnDays(_first,_last);
		var _oneDay=24*60*60*1000;
		for(var i=1;i<_days;i++){
			var _cur=new Date(_first).getTime()+_oneDay*i;
			if(_cur<new Date(_last)&&_cur>new Date(_first)){
				var _get=_returnFormat(_cur,'/');
				var $td=_obj.find('td[alt="'+_get+'"]');
				$td.addClass(_dtime.css.selected);
			}
		}
	}
})(jQuery);