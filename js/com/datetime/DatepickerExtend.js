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
		$(_dtime.id.target.obj).empty();
		var dateLeftObj=createElm.dateViewArea(opts.sdate,opts.edate);
		var dateRightObj=createElm.dateViewArea(opts.sdate,opts.edate);
		$(_dtime.id.target.obj).append(dateLeftObj);
		$(_dtime.id.target.obj).append(dateRightObj);
		var $dateAreaObj=$('.date-area');
		var $lObj=$dateAreaObj.find('table').eq(0);
		var $rObj=$dateAreaObj.find('table').eq(1);
		var $prev=$('a.prevMonth',$lObj);
		var $next=$('a.nextMonth',$rObj);
		var $tc=$('#dateShowCancel');
		var $shoutcut=$('#timeShortcut');
		var $te=$('#dateShowEdit');
		$prev.bind('click',function(){
			_exeAttach.prev($lObj,$rObj,opts);
		});
		$next.bind('click',function(){
			_exeAttach.next($lObj,$rObj,opts);
		});
		$(this).click(function(){
			var $this=$(this);
			if($('.date-area:hidden').length==1){
				$dateAreaObj.show();	
			}else{
				$dateAreaObj.hide();
				return false;
			}
			$lObj.find('a.nextMonth').hide();
			$rObj.find('a.prevMonth').hide();
			$dateAreaObj.css({
				position: opts.pos,
				left: opts.posleft,
				top: opts.postop
			});
			$rObj.css({left:190});
			$rObj.find('h5[alt=readDate]').css({'padding-left':'20px'});
			var readOldDate=_dtime.vars.readOldDate=[];
			var readNewDate=_dtime.vars.readNewDate=[];
			var submitDate=_dtime.vars.submitDate=[];
			_dtime.vars.publicDate=[];
			if($(opts.olddate).val()!=''){
				var oldjson=eval('('+$(opts.olddate).val()+')');
				$.each(oldjson,function(i,p){
					readOldDate.push(_cutsign(p,'-','/'));
					submitDate.push(_cutsign(p,'-','/'));
					_dtime.vars.publicDate.push(_cutsign(p,'-','/'));
				});
			}
			if($(opts.newdate).val()!=''){
				var newjson=eval('('+$(opts.newdate).val()+')');
				$.each(newjson,function(i,p){
					readNewDate.push(_cutsign(p,'-','/'));
					submitDate.push(_cutsign(p,'-','/'));
					_dtime.vars.publicDate.push(_cutsign(p,'-','/'));
				});
			}
			_exeAttach.loadTd(opts,submitDate.sort(),readOldDate);
			return false;
		});
	}
	/*---public json---*/
	 _dtime={
		'css':{
			'noselectedtime':'no-selected-time',
			'canceltime':'cancel-time',
			'selectedtime':'selected-time',
			'selected':'selected',
			'timesign':'timesign',
			'chosen':'chosen',
			'chosenn':'chosenn',
			'past':'past',
			'selectedblock':'selected-block',
			'noselectedblock':'no-selected-block',
			'altopt':'altopt',
			'over':'over',
			'weektip':'week-tip',
			'locking':'locking'
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
			'target':{
				'name':'date-control',
				'obj':'.date-control'
			}
		},
		'vars':{
			'weekUpper':{'0':'日','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六'},
			'signlen':1,
			'readOldDate':[],
			'readNewDate':[],
			'publicDate':[],
			'submitDate':[],
			'recordalt':'',
			'recordctrl':'',
			'ctrlsign':true,
			'dval':':[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]'
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
			frame.push('<div class="'+_dtime.id.target.name+'"></div>');
			frame.push('<div class="date-if"><span class="if-left"></span><div class="if-center"><input type="radio" id="custom" checked="checked" name="slimit" value="0"/><label>自定义</label><input type="radio" id="onlyWork" name="slimit" value="1"/><label>仅工作日</label><input type="radio" id="onlyWorkend" name="slimit" value="2"/><label>仅周末</label></div><span class="if-right"></span></div>'); //date-if
			frame.push('<div class="date-line"></div>');
			frame.push('<div class="date-but"><a href="javascript:void(0)" class="btton_confirm" id="dateSubmit"><span>确认</span></a>&nbsp;&nbsp;<a href="javascript:void(0)" class="btton_reset" id="dateReset"><span>重 置</span></a></div>');
			$(_this).append(frame.join(''));
		}
	},
	/*---bind event---*/
	_bindAttach=function(opts){
		var $ds=$('#dateSubmit');
		var $dr=$('#dateReset');
		var $lt=$(_dtime.id.loadTime.obj);
		var $lw=$(_dtime.id.loadWeek.obj);
		var $wt=$lw.find('dd.week-tip');
		var $la=$lt.find('li a[class!=no-selected-time]');
		var $slimit=$('input[name=slimit]');
		var $daobj=$(".date-area");
		$ds.bind('click',function(){
			_exeAttach.ds(this,opts);
			return false;
		});
		$dr.bind('click',function(){
			_exeAttach.dr(opts);
			return false;
		});
		$la.die().live('click',function(){
			_loadTime.timeper(this);
		});
		$wt.die().live('click',function(){
			_loadTime.cutovertip(this);
		});
		$slimit.bind('click',function(){
			if(!(_dtime.vars.submitDate.sort().toString() == _dtime.vars.readOldDate.sort().toString())){
				_exeAttach.slimit(this,opts);
			}
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
			var rDateStr=[];
			var newStr=[];
			var d=1
			rDateStr.push('[');
			newStr.push('[');
			var _start=_dtime.vars.submitDate[0];
			_dtime.vars.submitDate.sort();
			for(var i = 0, l = _dtime.vars.submitDate.length; i < l; i++) {
				if(_dtime.vars.submitDate[i]!=''){
					if(i==l-1){
						rDateStr.push('"'+_cutsign(_dtime.vars.submitDate[i],'/','-')+'"')
					}else{
						rDateStr.push('"'+_cutsign(_dtime.vars.submitDate[i],'/','-')+'",')
					}
					if($.inArray(_dtime.vars.submitDate[i],_dtime.vars.readOldDate)==-1){
						newStr.push('"'+_cutsign(_dtime.vars.submitDate[i],'/','-')+'",');
					}
				}
			}
			if(newStr.length!=1){
				var _lastnum=newStr.pop();
				var _signdel=_lastnum.substring(0,_lastnum.lastIndexOf(','));
				newStr.push(_signdel);
				newStr.push(']');
				$(opts.newdate).empty().val(newStr.join(''));
			}
			$(opts.starget).val(_start+' - '+_dtime.vars.submitDate.pop());
			rDateStr.push(']');
			$(opts.submitdate).empty().val(rDateStr.join(''));
			$('.date-area').hide();
		},
		dr:function(opts){
			var readOldDate=_dtime.vars.readOldDate=[];
			var readNewDate=_dtime.vars.readNewDate=[];
			var submitDate=_dtime.vars.submitDate=[];
			_dtime.vars.publicDate=[];
			if($(opts.olddate).val()!=''){
				var oldjson=eval('('+$(opts.olddate).val()+')');
				$.each(oldjson,function(i,p){
					readOldDate.push(_cutsign(p,'-','/'));
					submitDate.push(_cutsign(p,'-','/'));
					_dtime.vars.publicDate.push(_cutsign(p,'-','/'));
				});
			}
			if($(opts.newdate).val()!=''){
				var newjson=eval('('+$(opts.newdate).val()+')');
				$.each(newjson,function(i,p){
					readNewDate.push(_cutsign(p,'-','/'));
					submitDate.push(_cutsign(p,'-','/'));
					_dtime.vars.publicDate.push(_cutsign(p,'-','/'));
				});
			}
			this.loadTd(opts,submitDate.sort(),_dtime.vars.readOldDate);
			_dtime.vars.signlen=0;
			_dtime.vars.ctrlsign=true;
			_dtime.vars.recordalt='';
			_dtime.vars.recordctrl='';
		},
		prev:function($lObj,$rObj,opts){
			var _ly=$("select[name=year]",$lObj).val();
			var _lm=$("select[name=month]",$lObj).val();
			var _ry=$("select[name=year]",$rObj).val();
			var _rm=$("select[name=month]",$rObj).val();
			_lm--;_rm--;
			if(_lm==-1){_lm=11;_ly--}
			if(_rm==-1){_rm=11;_ry--}
			_loadMonth($lObj,opts,_dtime.vars.submitDate,_ly,_lm,_dtime.vars.readOldDate);
			_loadMonth($rObj,opts,_dtime.vars.submitDate,_ry,_rm,_dtime.vars.readOldDate);
		},
		next:function($lObj,$rObj,opts){
			var _ly=$("select[name=year]",$lObj).val();
			var _lm=$("select[name=month]",$lObj).val();
			var _ry=$("select[name=year]",$rObj).val();
			var _rm=$("select[name=month]",$rObj).val();
			_lm++;_rm++;
			if(_lm==12){_lm=0;_ly++}
			if(_rm==12){_rm=0;_ry++}
			_loadMonth($lObj,opts,_dtime.vars.submitDate,_ly,_lm,_dtime.vars.readOldDate);
			_loadMonth($rObj,opts,_dtime.vars.submitDate,_ry,_rm,_dtime.vars.readOldDate);
		},
		loadTd:function(opts,readDate,readOldDate){
			var _first=_returnymd(readDate[0]);
			var _last=_returnymd(readDate[readDate.length-1]);
			var _oy=_first.m+1==12?_first.y+1:_first.y;
			var _om=_first.m+1==12?0:_first.m+1;
			var $dateAreaObj=$('.date-area');
			var $lObj=$dateAreaObj.find('table').eq(0);
			var $rObj=$dateAreaObj.find('table').eq(1);
			_loadMonth($lObj,opts,readDate,_first.y,_first.m,readOldDate);
			_loadMonth($rObj,opts,readDate,_oy,_om,readOldDate);		
		},
		delsed:function($td,_get){
			var _index=$.inArray(_get,_dtime.vars.submitDate);
			var _index1=$.inArray(_get,_dtime.vars.publicDate);
			var _index2=$.inArray(_get,_dtime.vars.readOldDate);
			if($td.text()!=''&&_index2==-1){
				$td.attr('class','');
				$td.addClass(_dtime.css.altopt);
				if(_index!=-1)_dtime.vars.submitDate[_index]='n';_dtime.vars.publicDate[_index1]='n';
				_dtime.vars.submitDate=_returnNewArray(_dtime.vars.submitDate,'n,');
				_dtime.vars.publicDate=_returnNewArray(_dtime.vars.publicDate,'n,');
			}
		},
		slimit:function(othis,opts){
			var _val=othis.value;
			var $this=this;
			switch (_val*1)
			{
			case 0:  //other
				_dtime.vars.submitDate=[];
				jQuery.map(_dtime.vars.publicDate,function(n){
					_dtime.vars.submitDate.push(n);
				});
				$this.loadTd(opts,_dtime.vars.submitDate,_dtime.vars.readOldDate);
			break;
			case 1:  //only week
				_dtime.vars.submitDate=[];
				jQuery.map(_dtime.vars.publicDate,function(n){
					if($.inArray(n,_dtime.vars.readOldDate)==-1){
						_dtime.vars.submitDate.push(n);
					}
				});
				$.each(_dtime.vars.submitDate,function(i,p){
					var _week=new Date(p).getDay();
					if(_week==6||_week==0){
						_dtime.vars.submitDate[i]='n';
					}
				});
				var _array=_returnNewArray(_dtime.vars.submitDate,'n,');
				jQuery.map(_dtime.vars.readOldDate,function(n){
					_array.push(n);
				});
				_array.sort();
				if(_array!=''){$this.loadTd(opts,_array,_dtime.vars.readOldDate);}else{$this.emptysign();}
				_dtime.vars.submitDate=_array;
			break;
			case 2:  //only weekend
				_dtime.vars.submitDate=[];
				jQuery.map(_dtime.vars.publicDate.sort(),function(n){
					if($.inArray(n,_dtime.vars.readOldDate)==-1){
						_dtime.vars.submitDate.push(n);
					}
				});
				$.each(_dtime.vars.submitDate,function(i,p){
					var _week=new Date(p).getDay();
					if(_week!=6&&_week!=0){
						_dtime.vars.submitDate[i]='n';
					}
				});
				var _array=_returnNewArray(_dtime.vars.submitDate,'n,');
				jQuery.map(_dtime.vars.readOldDate,function(n){
					_array.push(n);
				});
				_array.sort();
				if(_array!=''){$this.loadTd(opts,_array,_dtime.vars.readOldDate);}else{$this.emptysign();}
				_dtime.vars.submitDate=_array;
			break;
			}
		},
		emptysign:function(){
			var $dateAreaObj=$('.date-area');
			var $lObj=$dateAreaObj.find('table').eq(0);
			var $rObj=$dateAreaObj.find('table').eq(1);
			$lObj.find('td').removeClass('timesign');
			$lObj.find('td').removeClass('selected');
			$lObj.find('td').removeClass('altopt');
			$rObj.find('td').removeClass('timesign');
			$rObj.find('td').removeClass('selected');
			$rObj.find('td').removeClass('altopt');
			$rObj.find('td').removeClass('locking');
		}
	},
	/*---load month---*/
	_loadMonth=function(_obj,_opts,_readDate,_y,_m,readOldDate){
		var date=[];
		var _daystr=new Date(_y,2,0).getDate() == 29?'31,29,31,30,31,30,31,31,30,31,30,31'.split(','):'31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
		var _days=_daystr[_m];
		var _index=new Date(_y,_m,1).getDay();
		var _cells=$(_obj).find('td').removeClass('timesign');var _cells=$(_obj).find('td').removeClass('selected');var _cells=$(_obj).find('td').removeClass('altopt');
		var _cells=$(_obj).find('td').removeClass('past');var _cells=$(_obj).find('td').removeClass('locking');var _cells=$(_obj).find('td').text('').removeAttr('alt').unbind('click').unbind('mouseenter mouseleave');
		$("select[name=month]", _obj).get(0).selectedIndex = _m;
		$("select[name=year]", _obj).get(0).selectedIndex = Math.max(0, _y - _opts.sdate);
		$("h5[alt=readDate]",_obj).text(_returnFormat(new Date(_y,_m,1),'/'));
		for(var i=0;i<_days;i++){
			var _cell = jQuery(_cells.get(i + _index));
			var _cur=_y+'/'+_returnTwo(_m*1+1)+'/'+_returnTwo(i+1);
			_cell.text(i+1).attr('alt',_cur);
			if((new Date(_y,_m,i+1).getTime()>=new Date(readOldDate[0]).getTime())&&(new Date(_y,_m,i+1).getTime()<=new Date(readOldDate[readOldDate.length-1]).getTime())){//selected center
				if($.inArray(_cur,readOldDate)!=-1){   //oldDate
					_cell.addClass(_dtime.css.selected);
				}
				if((new Date(_y,_m,i+1).getTime()==new Date(readOldDate[0]).getTime())&&(new Date(_y,_m,i+1).getTime()==new Date(_readDate[0]).getTime())){
					_cell.addClass(_dtime.css.timesign);
				}
				if((new Date(_y,_m,i+1).getTime()==new Date(readOldDate[readOldDate.length-1]).getTime())&&(new Date(_y,_m,i+1).getTime()==new Date(_readDate[_readDate.length-1]).getTime())){
					_cell.addClass(_dtime.css.timesign);
				}
				_cell.addClass(_dtime.css.locking);
			}else{
				if(new Date(_y,_m,i+1).getTime()<_returnTodayGetTime()){//pastDate
					_cell.addClass(_dtime.css.past);
				}else{  //otherDate
					if((new Date(_y,_m,i+1).getTime()>new Date(_readDate[0]).getTime())&&(new Date(_y,_m,i+1).getTime()<new Date(_readDate[_readDate.length-1]).getTime())){//selected center
						if($.inArray(_cur,_readDate)!=-1){
							_cell.addClass(_dtime.css.selected);
						}else{
							_cell.addClass(_dtime.css.altopt);
						}	
					}
					if((new Date(_y,_m,i+1).getTime()==new Date(_readDate[0]).getTime()||new Date(_y,_m,i+1).getTime()==new Date(_readDate[_readDate.length-1]).getTime())){//selected sign
						_cell.addClass(_dtime.css.timesign);
					}
					_cell.hover(function() {  //hover
						$(this).addClass(_dtime.css.over);
					},function() {
						$(this).removeClass(_dtime.css.over);
					}).click(function(e) {  //click
						_tdclick(e,this);
						return false;
					});
				}
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
	_returnNewArray=function(_array,_sign){
		var _str=_array.sort().join(',');
		var _signdel=_sign.substring(0,_sign.lastIndexOf(','));
		_array=_cutsign(_str,_sign,'').split(',');
		if(_array[_array.length-1]==_signdel){
			_array.pop();
		}
		return _array;
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
	_returnAllDate=function(_first,_last,_days,_array){
		var _oneDay=24*60*60*1000;
		for(var i=0;i<=_days;i++){
			var _cur=new Date(_first).getTime()+_oneDay*i;
			if(_cur<=new Date(_last)&&_cur>=new Date(_first)){
				_array.push(_returnFormat(_cur,'-'));
			}
		}
	},
	_returnFront=function(dobj,num,_array){
		if(dobj.constructor != Date){
			dobj=new Date(dobj);
		}
		var _oneDay=24*60*60*1000;
		for(var i=num;i>0;i--){
			var _cur=dobj.getTime()-new Date(i*_oneDay).getTime();
			_array.push(_returnFormat(_cur,'-'));
		}
	},
	_returnAfter=function(dobj,num,_array){
		if(dobj.constructor != Date){
			dobj=new Date(dobj);
		}
		var _oneDay=24*60*60*1000;
		for(var i=1;i<=num;i++){
			var _cur=dobj.getTime()+new Date(i*_oneDay).getTime();
				_array.push(_returnFormat(_cur,'-'));
		}
	},
	/*---date per click---*/
    _tdclick=function(e,_this){
		var _past=$(_this).hasClass(_dtime.css.past);
		var _selected=$(_this).hasClass(_dtime.css.selected);
		var _timesign=$(_this).hasClass(_dtime.css.timesign);
		var _altopt=$(_this).hasClass(_dtime.css.altopt);
		if(!e)e=window.event;
		if(e.altKey){  /*---alt key---*/
			if(_selected&&_dtime.vars.submitDate!=''){
				$(_this).removeClass(_dtime.css.selected);
				$(_this).addClass(_dtime.css.altopt);
				var _alt=$(_this).attr('alt');
				var _index=$.inArray(_alt,_dtime.vars.submitDate);
				var _index1=$.inArray(_alt,_dtime.vars.publicDate);
				if(_index!=-1)_dtime.vars.submitDate[_index]='n';_dtime.vars.publicDate[_index1]='n';
				_dtime.vars.submitDate=_returnNewArray(_dtime.vars.submitDate,'n,');
				_dtime.vars.publicDate=_returnNewArray(_dtime.vars.publicDate,'n,');
				_dtime.vars.recordalt=_alt;
			}else if(_altopt){
				$(_this).addClass(_dtime.css.selected);
				$(_this).removeClass(_dtime.css.altopt);
				var _alt=$(_this).attr('alt');
				var _cache=_dtime.vars.submitDate[_dtime.vars.submitDate.length-1];
				_dtime.vars.submitDate.push(_alt);
				_dtime.vars.submitDate.sort();
				_dtime.vars.publicDate.push(_alt)
				_dtime.vars.publicDate.sort()
			}
		}else if(e.ctrlKey){  /*---ctrl key---*/
			if(_selected){
				if(_dtime.vars.recordalt!=''){
					var _first=_dtime.vars.recordalt;
					var _last=$(_this).attr('alt');
					$(_this).removeClass(_dtime.css.selected);
					$(_this).addClass(_dtime.css.altopt);
					var _index=$.inArray(_last,_dtime.vars.submitDate);
					var _index1=$.inArray(_alt,_dtime.vars.publicDate);
					if(_index!=-1)_dtime.vars.submitDate[_index]='n';_dtime.vars.publicDate[_index1]='n';
					_dtime.vars.readDate=_returnNewArray(_dtime.vars.submitDate,'n,');
					_dtime.vars.publicDate=_returnNewArray(_dtime.vars.publicDate,'n,');
					_tdSign(_first,_last,_exeAttach.delsed);
				}else{
					var _alt=$(_this).attr('alt');
					$(_this).attr('class','');
					$(_this).addClass(_dtime.css.altopt);
					var _index=$.inArray(_alt,_dtime.vars.submitDate);
					var _index1=$.inArray(_alt,_dtime.vars.publicDate);
					if(_index!=-1)_dtime.vars.submitDate[_index]='n';_dtime.vars.publicDate[_index1]='n';
					_dtime.vars.submitDate=_returnNewArray(_dtime.vars.submitDate,'n,');
					_dtime.vars.publicDate=_returnNewArray(_dtime.vars.publicDate,'n,');
					if(_dtime.vars.ctrlsign){
						_dtime.vars.recordctrl=_alt;
						_dtime.vars.ctrlsign=false;
					}else{
						var _first=_dtime.vars.recordctrl;					
						var _last=$(_this).attr('alt');
						_tdSign(_first,_last,_exeAttach.delsed)
						_dtime.vars.ctrlsign=true;
					}
				}
			}else if(!_selected&&!_timesign&&!_past&&!_altopt){  /*---extend---*/
				var _alt=$(_this).attr('alt');
				var _prev=$(_this).prev().hasClass(_dtime.css.selected);
				var _next=$(_this).next().hasClass(_dtime.css.selected);
				var _first=_dtime.vars.readDate[0];
				if(new Date(_alt).getTime()>new Date(_first).getTime()){  //after
					var _first=_dtime.vars.readDate.pop();
					var _days=_returnDays(_first,_alt);
					var _oneDay=24*60*60*1000;
					var $table=$('.date-control table');
					for(var i=0;i<_days;i++){
						var _cur=new Date(_first).getTime()+_oneDay*i;
						if(_cur<=new Date(_alt)&&_cur>=new Date(_first)){
							var _get=_returnFormat(_cur,'/');
							var $td=$table.find('td[alt="'+_get+'"]');
							if($td.text()!=''){
								$td.attr('class','');
								if(i==_days-1){
									$td.addClass(_dtime.css.timesign);
								}else{
									$td.addClass(_dtime.css.selected);
								}
							}
							_dtime.vars.readDate.push(_get);
							_dtime.vars.publicDate.push(_get);
						}
					}
					if(!_prev){
						$table.find('td[alt="'+_dtime.vars.readDate[0]+'"]').attr('class',_dtime.css.timesign);
						_dtime.vars.signlen++;
						_dtime.vars.ctrlsign=true;
						_dtime.vars.recordalt='';
						_dtime.vars.recordctrl='';
					}
				}else{  //before
					var _last=_dtime.vars.readDate.shift();
					var _days=_returnDays(_alt,_last);
					var _oneDay=24*60*60*1000;
					var $table=$('.date-control table');
					for(var i=0;i<_days;i++){
						var _cur=new Date(_last).getTime()-_oneDay*i;
						if(_cur<=new Date(_last)&&_cur>=new Date(_alt)){
							var _get=_returnFormat(_cur,'/');
							var $td=$table.find('td[alt="'+_get+'"]');
							if($td.text()!=''){
								$td.attr('class','');
								if(i==_days-1){
									$td.addClass(_dtime.css.timesign);
								}else{
									$td.addClass(_dtime.css.selected);
								}
							}
							_dtime.vars.readDate.unshift(_get);
							_dtime.vars.publicDate.unshift(_get);
						}
					}
					if(!_next){
						$table.find('td[alt="'+_dtime.vars.readDate[_dtime.vars.readDate.length-1]+'"]').attr('class',_dtime.css.timesign);
						_dtime.vars.signlen++;
						_dtime.vars.ctrlsign=true;
						_dtime.vars.recordalt='';
						_dtime.vars.recordctrl='';
					}
				}
			}
		}else{   /*---normal---*/
			$alltd=$('.date-control table td');
			$alltd.removeClass(_dtime.css.selected);
			$alltd.removeClass(_dtime.css.timesign);
			$alltd.removeClass(_dtime.css.altopt);
			//$alltd.removeClass(_dtime.css.locking);
			$(_this).addClass(_dtime.css.timesign);
			var _alt=$(_this).attr('alt');
			if(new Date(_alt).getTime()>new Date(_dtime.vars.readOldDate[_dtime.vars.readOldDate.length-1]).getTime()){  //after
				var _last=$(_this).attr('alt');
				var _first=_dtime.vars.submitDate[0];
			}else if(new Date(_alt).getTime()<new Date(_dtime.vars.readOldDate[0]).getTime()){  //front
				var _first=$(_this).attr('alt');
				var _last=_dtime.vars.submitDate[_dtime.vars.submitDate.length-1];
			}
			_tdSignExtend(_first,_last);
		}
	},
	/*---ctrl opt sign---*/
	_tdSign=function(_first,_last,_call){
		if(new Date(_last).getTime()<new Date(_first).getTime()){
				var _cache=_first;
				_first=_last;
				_last=_cache;
		}
		var _days=_returnDays(_first,_last);
		var _oneDay=24*60*60*1000;
		var $table=$('.date-control table');
		for(var i=1;i<_days;i++){
			var _cur=new Date(_first).getTime()+_oneDay*i;
			if(_cur<new Date(_last)&&_cur>new Date(_first)){
				var _get=_returnFormat(_cur,'/');
				var $td=$table.find('td[alt="'+_get+'"]');
				_call($td,_get);
			}
		}
	},
   /*---extend opt---*/
   _tdSignExtend=function(_first,_last){
		_dtime.vars.submitDate=[];
		_dtime.vars.publicDate=[];
        if(new Date(_last).getTime()<new Date(_first).getTime()){
				var _cache=_first;
				_first=_last;
				_last=_cache;
		}
		var _days=_returnDays(_first,_last);
		var _oneDay=24*60*60*1000;
		var $table=$('.date-control table');
		for(var i=0;i<=_days;i++){
			var _cur=new Date(_first).getTime()+_oneDay*i;
			if(_cur<=new Date(_last)&&_cur>=new Date(_first)){
				var _get=_returnFormat(_cur,'/');
				var $td=$table.find('td[alt="'+_get+'"]');
				if($td.text()!=''){
					if($td.hasClass('locking')&&$.inArray(_get,_dtime.vars.readOldDate)!=-1){
						$td.addClass(_dtime.css.selected);
						$td.addClass(_dtime.css.locking);
					}else if(!$td.hasClass('locking')){
						$td.addClass(_dtime.css.selected);
					}
				}
				if(i==0){
					$td.addClass(_dtime.css.timesign);
				}
				if(i==_days-1){
					$td.addClass(_dtime.css.timesign);
				}
				if($td.hasClass('locking')&&$.inArray(_get,_dtime.vars.readOldDate)!=-1){
					_dtime.vars.submitDate.push(_get);
					_dtime.vars.publicDate.push(_get);
				}else if(!$td.hasClass('locking')){
					_dtime.vars.submitDate.push(_get);
					_dtime.vars.publicDate.push(_get);
				}
			}
		}
   }
})(jQuery);