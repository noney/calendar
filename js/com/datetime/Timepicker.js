(function($){
	 /*---load time---*/
	$.extend({
		initTime:function(_addparid,_timehid,_editparid){
			_addparid.empty();
			_loadTime.load(_addparid,_timehid,_editparid);
		}
	});
	/*---public json---*/
	 _dtime={
		'css':{
			'selected':'selected',
			'cancel':'cancel',
			'nooption':'no-option',
			'weektip':'week-tip'
		},
		'id':{
			'loadTime':{
				'name':'loadTime',
				'obj':'#loadTime'
			}
		},
		'vars':{
			'weekUpper':{'0':'日','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六'},
			'dval':':[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]'
		}
    },
	/*---create element---*/
	createElm={
		thead:function(){
			var table=[];
			var thone=[];
			var thtwo=[];
			var notd=[];
			table.push('<table cellspacing="0" cellpadding="0" border="0"><thead>');
			thone.push('<tr class="nbor th1"><th class="t1 w62 pl13" rowspan="2">日期</th><th class="t1 w70" rowspan="2">时间段</th>');
			thone.push('<th class="pt5" colspan="4">&nbsp;&nbsp;0点&mdash;3点</th><th class="pt5" colspan="4">&nbsp;&nbsp;4点&mdash;7点</th>');
			thone.push('<th class="pt5" colspan="4">&nbsp;8点&mdash;11点</th><th class="pt5" colspan="4">&nbsp;12点&mdash;15点</th>');
			thone.push('<th class="pt5" colspan="4">&nbsp;16点&mdash;19点</th><th class="pt5" colspan="4">&nbsp;20点&mdash;23点</th></tr>');
			table.push(thone.join(''));
			thtwo.push('<tr>');
			for(var i=0;i<=23;i++){
				if((i+1)%4==0){
					if(i==23){
						thtwo.push('<th class="w30"><a class="week-tip" href="javascript:void(0)" index='+i+'></a></th>');
					}else{
						thtwo.push('<th class="w50"><a class="week-tip" href="javascript:void(0)" index='+i+'></a></th>');
					}
				}else{
					thtwo.push('<th><a class="week-tip" href="javascript:void(0)" index='+i+'></a></th>');
				}
				notd.push('<td><a class="no-option" href="javascript:void(0)"></a></td>');
			}
			thtwo.push('</tr>');
			table.push(thtwo.join('')+'</thead><tbody>');
			return {thead:table.join(''),notd:notd.join('')};
		},	
		timeTd:function(_array,_json,_obj){
			var allTd=[];
			var curmonth=[];
			var curdate=[];
			var week=[];
			allTd.push('<div id="setTime" class="set-time">'+_timehead.thead);
			for(var i=0,l=_array.length;i<l;i++){
				var _alt=_array[i];
				var _getdate=new Date(_cutsign(_alt,'-','/')).getDate();
				var _getday=new Date(_cutsign(_alt,'-','/')).getDay();
				if(typeof(_json[_array[i]])=='undefined'){
					curdate.push('<span class="no-date">'+_returnTwo(_getdate)+'</span>');
					allTd.push('<tr><td class="pl13">星期'+_dtime.vars.weekUpper[_getday]+'</td><td>没有投放</td>'+_timehead.notd+'</tr>');
				}else{
					var _week=new Date(_cutsign(_alt,'-','/')).getDay();
					var _month=new Date(_cutsign(_alt,'-','/')).getMonth()+1;
					curdate.push('<span class="have-date">'+_returnTwo(_getdate)+'</span>');
					if($.inArray(_month,curmonth)==-1){
						curmonth.push(_month);
					}
					if(_json[_array[i]].length==24){
						allTd.push('<tr><td class="pl13">星期'+_dtime.vars.weekUpper[_getday]+'</td><td alt='+_alt+'>全天投放</td>');
					}else{
						allTd.push('<tr><td class="pl13">星期'+_dtime.vars.weekUpper[_getday]+'</td><td alt='+_alt+'>时段投放</td>');
					}
					for(var k=0;k<=23;k++){
						if($.inArray(k,_json[_array[i]])!=-1){
							allTd.push('<td><a class="selected" href="javascript:void(0)" index='+k+' alt='+_alt+' week='+_week+'></a></td>');
						}else{
							allTd.push('<td><a class="cancel" href="javascript:void(0)" index='+k+' alt='+_alt+' week='+_week+'></a></td>');
						}
					}
					allTd.push('</tr>');
				}
			}
			allTd.push('</tbody></table></div>');
			allTd.unshift('<div class="set-date" id="setDay"><div class="time-up" id="timeUp"></div><div id="viewDate" class="view-date">'+curdate.join('')+'</div><div class="time-down" id="timeDown"></div></div>');//curdate
			if(curmonth.length==1){
				allTd.unshift('<div class="set-month" id="SetMonth">'+curmonth[0]+'月</div>');//curmonth
			}
			allTd.push('<div class="clear"></div>');
			_obj.empty().append(allTd.join(''));
			_obj.find('tr:last').addClass('nbor');
			if($.browser.msie){allTd=null;curmonth=null;curdate=null;week=null;CollectGarbage();setTimeout(CollectGarbage,1);}
		},
		timeDl:function(_json,_parid,_first,_last){
			var allDl=[];
			var onesome=[];
			var _count=0;
			allDl.push('<div id="editTime" class="edit-time"><span class="t2">投放周期：'+_first+' 至 '+_last+'</span><div class="show-time">');
			$.each(_json,function(i,p){
				allDl.push('<dl><dt>'+i+'</dt>');
				_count++;
				switch(p.length*1){
					case 0:
						allDl.push('<dd>无投放</dd></dl>');
						break;
					case 24:
						allDl.push('<dd>全天</dd></dl>');
						break;
					default:
						for(var i = 0, l = p.length; i < l; i++) {
							if(p[i]+1==p[i+1]){
								onesome.push(p[i]);
							}else{
								onesome.push(p[i]);
								var _num=(onesome[onesome.length-1]==23)?0:onesome[onesome.length-1]*1+1;
								allDl.push('<dd>'+onesome[0]+':00-'+_num+':00</dd>');
								onesome=[];
							}
						}
						allDl.push('</dl>');
				}
				if((_count)%10==0){
					allDl.push('<div class="clear"></div>');
				}
			});
			allDl.push('</div></div>');
			_parid.empty().append(allDl.join(''));
			if($.browser.msie){allDl=null;onesome=null;CollectGarbage();setTimeout(CollectGarbage,1);}
		}
	},
	/*---bind event---*/
	_bindAttach=function(opts){
		var $settime=$('#setTime');
		var $timeper=$settime.find('td a[class!=no-option]');
		var $weektip=$settime.find('th a.week-tip');
		var $down=$('#timeDown');
		var $up=$('#timeUp');
		var $submit=$('#timeSubmit');
		var $etime=$('#editTime');
		$timeper.bind('click',function(){
			_loadTime.timeper(this,$settime);
		});
		$weektip.bind('click',function(){
			_loadTime.weektip(this,$settime);
		});
		$down.bind('click',function(){
			_loadTime.down();
		});
		$up.bind('click',function(){
			_loadTime.up();
		});
		$submit.bind('click',function(){
			_loadTime.timesubmit($etime);
		});
	},
	/*---load times---*/
	_loadTime={
		_weeklen:0,
		_index:0,
		_darray:[],
		_frontlen:0,
		_afterlen:0,
		_timejson:null,
		_daylen:0,
		_alldaylen:0,
		_alldate:[],
		_addparid:null,
		_editparid:null,
		_hidval:null,
		_cachearray:[],
		load:function(_addparid,hidval,_editparid){
			var $this=this;
			$this._weeklen=0;
			$this._index=0;
			$this._darray=[];
			$this._alldate=[];
			$this._frontlen=0;
			$this._afterlen=0;
			$this._timejson=null;
			$this._addparid=$(_addparid);
			$this._editparid=$(_editparid);
			$this.hidval=$(hidval);
			$this._timejson=eval('('+$this.hidval.val()+')');
			$this._cachearray=[];
			$.each($this._timejson,function(i,p){
				$this._darray.push(i);
			});

			var _first=new Date(_cutsign($this._darray[0],'-','/'));
			var _last=new Date(_cutsign($this._darray[$this._darray.length-1],'-','/'));

			$this._frontlen=_first.getDay()==0?6:6-(7-_first.getDay());
			$this._afterlen=_last.getDay()==0?0:7-_last.getDay();
			$this._daylen=_returnDays(_first,_last);
			$this._alldaylen=($this._frontlen+$this._afterlen+$this._daylen);

			_returnFront(_first,$this._frontlen,$this._alldate);
			_returnAllDate(_first,_last,$this._daylen,$this._alldate);
			_returnAfter(_last,$this._afterlen,$this._alldate);
			$this._weeklen=($this._alldate.length)/7;
			$this.timedate($this._index);
		},
		down:function(){
			var $this=this;
			if($this._weeklen-1>$this._index){
				$this._index++;
				$this.timedate($this._index);
			}
		},
		up:function(){
			var $this=this;
			if($this._index>0){
				$this._index--;
				$this.timedate($this._index);
			}
		},
		timedate:function(_index){
			var $this=this;
			$this._cachearray=[];
			var dd=[];
			var _start=parseInt(_index)*7;
			var _end=_start+6;
			for(var i=_start;i<=_end;i++){
				$this._cachearray.push($this._alldate[i]);
			}
			createElm.timeTd($this._cachearray,$this._timejson,$this._addparid);
			_bindAttach();//bind
		},
		timeper:function(_this,$settime){
			var $_this=$(_this);
			var $this=this;
			var _alt=$_this.attr('alt');
			var _index=$_this.attr('index');
			if($_this.hasClass(_dtime.css.cancel)){
				$_this.removeClass(_dtime.css.cancel).addClass(_dtime.css.selected);
				$this._timejson[_alt].push(_index*1);
				$this._timejson[_alt].sort(_sortNumber);
				if($this._timejson[_alt].length==24){
					$settime.find('td[alt='+_alt+']').text('全天投放');
				}
			}else{
				$_this.addClass(_dtime.css.cancel).removeClass(_dtime.css.selected);
				var __index=$.inArray(_index*1,$this._timejson[_alt]);
				$this._timejson[_alt][__index]=25;
				var _array=_returnNewArray($this._timejson[_alt],25);
				$this._timejson[_alt]=[];
				$.map(_array,function(n){
					$this._timejson[_alt].push(n*1);
				});
				$settime.find('td[alt='+_alt+']').text('时段投放');
			}
		},
		weektip:function(_this,$settime){
			var $_this=$(_this);
			var $this=this;
			var _index=$_this.attr('index');
			var _yeslen=0;
			var _sellen=0;
			$.each($this._cachearray,function(i,p){
				var $cur=$settime.find('td a[alt='+p+']');
				var $yes=$settime.find('td a[alt='+p+'][index='+_index+']');
				if(typeof($cur.attr('index'))!='undefined'){
					_yeslen=_yeslen+1;
				}
				if($yes.hasClass(_dtime.css.selected)){
					_sellen=_sellen+1;
				}
			});
			if(_yeslen==_sellen){
				$.each($this._cachearray,function(i,p){
					var $cur=$settime.find('td a[alt='+p+'][index='+_index+']');
					var $yes=$settime.find('td a[alt='+p+'][index='+_index+']');
					if(typeof($cur.attr('index'))!='undefined'){
						if($yes.hasClass(_dtime.css.selected)){
							$cur.addClass(_dtime.css.cancel).removeClass(_dtime.css.selected);
							var __index=$.inArray(_index*1,$this._timejson[p]);
							$this._timejson[p][__index]=25;
							var _array=_returnNewArray($this._timejson[p],25);
							$this._timejson[p]=[];
							$.map(_array,function(n){
								$this._timejson[p].push(n*1);
							});
							$settime.find('td[alt='+p+']').text('时段投放');
						}
					}
				})
			}else{
				$.each($this._cachearray,function(i,p){
					var $cur=$settime.find('td a[alt='+p+'][index='+_index+']');
					var $yes=$settime.find('td a[alt='+p+'][index='+_index+']');
					if(typeof($cur.attr('index'))!='undefined'){
						if($yes.hasClass(_dtime.css.cancel)){
							$cur.removeClass(_dtime.css.cancel).addClass(_dtime.css.selected);
							$this._timejson[p].push(_index*1);
							$this._timejson[p].sort(_sortNumber);
							if($this._timejson[p].length==24){
								$settime.find('td[alt='+p+']').text('全天投放');
							}
						}
					}
				})	
			}
		},
		timesubmit:function($etime){
			var $this=this;
			var alltime=[];
			var _first=$this._darray[0];
			var _last=$this._darray[$this._darray.length-1];
			alltime.push('{');
			$.each($this._timejson,function(i,p){
				alltime.push('"'+i+'":['+p+'],');
			});
			$this.hidval.val(alltime.join('').substring(0,alltime.join('').lastIndexOf(','))+'}');
			$etime.text('编辑时段定向');
			$etime.attr('alt','edit');
			//$this._addparid.empty();
			createElm.timeDl($this._timejson,$this._editparid,_first,_last);
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
	_returnNewArray=function(_array,_sign){
		var _str=_array.sort(_sortNumber).join(',');
		_array=_cutsign(_str,_sign,'').split(',');
		_array.pop();
		return _array;
	},
	_sortNumber=function(a,b){
			return a-b;
	}
	var _timehead=createElm.thead();
})(jQuery);