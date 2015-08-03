(function($){
	 /*---load date---*/
	 $.fn.initDate=function(options){
		var settings={
			 sdate:2000,
			 edate:2050
		};
		if(options)var opts=$.extend(settings,options);
		var $puttype=$('#allWeatherShow');
		_setPutType(opts,$puttype);
		createElm.dateFrame(opts.parentid);
		createElm.tiemFrame(opts.timeparentid);
		_bindAttach(opts);//bind
		$(opts.target).empty();
		var dateLeftObj=createElm.dateViewArea(opts.sdate,opts.edate);
		var dateRightObj=createElm.dateViewArea(opts.sdate,opts.edate);
		$(opts.target).append(dateLeftObj);
		$(opts.target).append(dateRightObj);
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
		$dateAreaObj.bind('click',function(e){
			$dateAreaObj.show();
			return false;
		});
		$(this).click(function(){
			var $this=$(this);
			if($('.date-area:hidden').length==1){
				$dateAreaObj.show();	
			}else{
				$dateAreaObj.hide();
				$te.css({"color":"#4F4F4F"});
				$te.unbind('click');
				$te.bind('click',function(){
					_exeAttach.te(this,opts,$tc,$shoutcut);
				});
				return false;
			}
			$(_dtime.id.dateshowedit.obj).css({"color":"#ccc"});
			$(_dtime.id.dateshowedit.obj).unbind('click');
			$lObj.find('a.nextMonth').hide();
			$rObj.find('a.prevMonth').hide();
			$dateAreaObj.css({
				position: opts.pos,
				left: opts.posleft,
				top: opts.postop
			});
			$rObj.css({left:190});
			$rObj.find('h5[alt=readDate]').css({'padding-left':'20px'});
			_exeAttach.loadTd(opts);
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
			}
		},
		'vars':{
			'weekUpper':{'0':'日','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六'},
			'signlen':1,
			'readDate':[],
			'recordalt':'',
			'recordctrl':'',
			'ctrlsign':true,
			'dval':':[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]'
		},
		'addattr':{
			'twosign':'twosign'
		},
		'tip':{
			'allday':'全天候展示广告',
			'time':'仅在选定时段展示广告'
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
			table.push('<tr class="controls"><th colspan="10"><p class="none">' + yselect.join('') + '&nbsp;' + mselect.join('') + '</p><span class="l-angel"></span><span class="top-center"><a href="javascript:void(0)" class="prevMonth"></a><h5 alt="readDate"></h5><a href="javascript:void(0)" class="nextMonth"></a></span><span class="r-angel"></span></th></tr>');
			table.push('<tr class="days"><th class="l-border">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="r-border">六</th></tr></thead><tbody>');
			for (var i = 0; i < 6; i++) {
                table.push('<tr><td class="l-border"></td><td></td><td></td><td></td><td></td><td></td><td style="border-right:1px solid #dddbd8"></td></tr>');
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
		},
		tiemFrame:function(_par){
			var frame=[];
			frame.push('<div class="time-area">');
			frame.push('<div class="date-if"><span class="if-left"></span><dl class="if-center"><dt><input type="radio" id="allSelectDate" checked="checked" name="slimit" value="0"/></dt><dd>全部</dd><dt><input type="radio" id="onlyWork" name="slimit" value="1"/></dt><dd>仅工作日</dd><dt><input type="radio" id="onlyWorkend" name="slimit" value="2"/></dt><dd>仅周末</dd></dl><span class="if-right"></span></div>'); //date-if
			frame.push('<div class="time-select" id="timeSelect"><div class="week-view"><div class="load-left-week" id="loadLeftWeek"></div><div class="center-week" id="'+_dtime.id.loadWeek.name+'"></div><div class="load-right-week" id="loadRightWeek"></div></div><div class="time-view" id="'+_dtime.id.loadTime.name+'"></div></div>');  //time-select
			frame.push('<div class="date-but"><a href="javascript:void(0)" class="btton_confirm" id="timeConfirm"><span>确认</span></a>&nbsp;&nbsp;<a href="javascript:void(0)" class="btton_reset" id="timeReset"><span>重 置</span></a></div></div>');  //date-but
			if(_par)$(_par).append(frame.join(''));
		},
		table:function(){
			var table=[]
			table.push('<table width="95%" border="0" cellspacing="0" cellpadding="0"><tbody><tr>');
			var aStr=[];
			aStr.push('<a class="'+_dtime.css.selectedtime+'" href="javascript:void(0)">&nbsp;</a>');
			var tdStr=[];
			var liStr=[];
			for(var t=0;t<=23;t++){
				var time_str=(t.toString().length==1)?'0'+t:t;
				if((t+1)%4==0){
					tdStr.push('<li class="sign-time3"><span class="time-ico"><em class="time-num">'+time_str+'</em>:00</span></li>');
				}else if(t%4==0){
					tdStr.push('<li class="sign-time1"><span class="time-ico"><em class="time-num">'+time_str+'</em>:00</span></li>');
				}else{
					tdStr.push('<li class="sign-time2"><span class="time-ico"><em class="time-num">'+time_str+'</em>:00</span></li>');
				}
				if((t+1)%4==0){
					liStr.push('<li class="pb15"><a href="javascript:void(0)" class="no-selected-time">&nbsp;</a></li>');
				}else{
					liStr.push('<li><a href="javascript:void(0)" class="no-selected-time">&nbsp;</a></li>');
				}
			}
			table.push('<td class="time_sign_td"><ul>'+tdStr.join('')+'</ul></td>');
			var tEnd='</tr></tbody></table>';
			return {tStart:table.join(''),tEnd:tEnd,liStr:liStr.join('')};
		},
		timeTd:function(_array,_json,_obj){
			var allTd=[];
			for(var i=0,l=_array.length;i<l;i++){
				allTd.push('<td><ul>');
				if(typeof(_json[_array[i]])=='undefined'){
					allTd.push(_timeable.liStr);
				}else{
					var _alt=_array[i];
					var _week=new Date(_cutsign(_alt,'-','/')).getDay();
					for(var k=0;k<=23;k++){
						if($.inArray(k,_json[_array[i]])!=-1){
							if((k+1)%4==0){
								allTd.push('<li class="pb15"><a href="javascript:void(0)" class="selected-time" index='+k+' alt='+_alt+' week='+_week+'>&nbsp;</a></li>');
							}else{
								allTd.push('<li><a href="javascript:void(0)" class="selected-time" index='+k+' alt='+_alt+' week='+_week+'>&nbsp;</a></li>');
							}
						}else{
							if((k+1)%4==0){
								allTd.push('<li class="pb15"><a href="javascript:void(0)" class="cancel-time" index='+k+' alt='+_alt+' week='+_week+'>&nbsp;</a></li>');
							}else{
								allTd.push('<li><a href="javascript:void(0)" class="cancel-time" index='+k+' alt='+_alt+' week='+_week+'>&nbsp;</a></li>');
							}
						}
					}
				}
				allTd.push('</ul></td>');
			}
			_obj.empty().append(_timeable.tStart+allTd.join('')+_timeable.tEnd);
			_obj.find('td:last').addClass('pr0');
			if($.browser.msie){allTd=null;CollectGarbage();setTimeout(CollectGarbage,1);}
		},
		weekDl:function(_array,_json,_obj){
			var allDl=[];
			for(var i=0,l=_array.length;i<l;i++){
				var _cdate=_cutsign(_array[i],'-','/');
				if(typeof(_json[_array[i]])=='undefined'){
					allDl.push('<dl class="'+_dtime.css.noselectedblock+'" alt="noOption"><dt>'+_dtime.vars.weekUpper[new Date(_cdate).getDay()]+'</dt><dd>'+_returnTwo(new Date(_cdate).getDate())+'日</dd><dd class="'+_dtime.css.weektip+'"></dd></dl>');
				}else{
					allDl.push('<dl class="'+_dtime.css.selectedblock+'" alt="'+_array[i]+'"><dt>'+_dtime.vars.weekUpper[new Date(_cdate).getDay()]+'</dt><dd>'+_returnTwo(new Date(_cdate).getDate())+'日</dd><dd class="'+_dtime.css.weektip+'"></dd></dl>');
				}
			}
			_obj.empty().append(allDl.join(''));
			_obj.find('td:last').addClass('pr0');
			if($.browser.msie){allDl=null;CollectGarbage();setTimeout(CollectGarbage,1);}
		}
	},
	/*---bind event---*/
	_bindAttach=function(opts){
		var $ds=$('#dateSubmit');
		var $dr=$('#dateReset');
		var $te=$('#dateShowEdit');
		var $tc=$('#dateShowCancel');
		var $lt=$(_dtime.id.loadTime.obj);
		var $lw=$(_dtime.id.loadWeek.obj);
		var $wt=$lw.find('dd.week-tip');
		var $la=$lt.find('li a[class!=no-selected-time]');
		var $tr=$('#timeReset');
		var $right=$('#loadRightWeek');
		var $left=$('#loadLeftWeek');
		var $slimit=$('input[name=slimit]');
		var $ts=$('#timeConfirm');
		var $puttype=$('#allWeatherShow');
		var $shoutcut=$('#timeShortcut');
		var $daobj=$(".date-area");
		$ds.bind('click',function(){
			_exeAttach.ds(this,opts,$puttype,$tc,$shoutcut);
			return false;
		});
		$dr.bind('click',function(){
			_exeAttach.dr(opts,$shoutcut,$puttype);
			return false;
		});
		$te.bind('click',function(){
			_exeAttach.te(this,opts,$tc,$shoutcut,$puttype);
		});
		$la.die().live('click',function(){
			_loadTime.timeper(this);
		});
		$wt.die().live('click',function(){
			_loadTime.cutovertip(this);
		});
		$tr.die().live('click',function(){
			_loadTime.load(opts,$shoutcut,$puttype);
		});
		$tc.bind('click',function(){
			_exeAttach.tc(this,$te,opts);
		});
		$right.bind('click',function(){
			_loadTime.right(opts);
		});
		$left.bind('click',function(){
			_loadTime.left(opts);
		});
		$slimit.bind('click',function(){
			_loadTime.slimit(this,opts);
		});
		$ts.bind('click',function(){
			_loadTime.timesubmit(opts,$te,$tc,$puttype,$shoutcut);
		});
		$(document).bind('click',function(){
			if($('.date-area:hidden').length==0){
				$daobj.hide();
				$te.css({"color":"#4F4F4F"});
				$te.bind('click',function(){
					_exeAttach.te(this,opts,$tc,$shoutcut);
				});
			}
		});
	},
	/*---extecut event---*/
	_exeAttach={
		ds:function(_this,opts,$puttype,$tc,$shoutcut){
			var _start=_dtime.vars.readDate[0];
			_dtime.vars.readDate.sort();
			var rDateStr=[];
			rDateStr.push('{');
			for(var i = 0, l = _dtime.vars.readDate.length; i < l; i++) {
				if(_dtime.vars.readDate[i]!=''){
					rDateStr.push('"'+_cutsign(_dtime.vars.readDate[i],'/','-')+'"')
					if(i==l-1){
						rDateStr.push(_dtime.vars.dval);
					}else{
						rDateStr.push(_dtime.vars.dval+',');
					}
				}
			}
			rDateStr.push('}');
			$(opts.returnvalid).empty().val(rDateStr.join(''));
			$(opts.starget).val(_start+' - '+_dtime.vars.readDate.pop());
			$(_dtime.id.shortcut.obj).val(0);
			$puttype.text("全天候展示广告");
			$(_dtime.id.dateshowedit.obj).css({"color":"#4F4F4F"});
			$(_dtime.id.dateshowedit.obj).unbind('click');
			$(_dtime.id.dateshowedit.obj).bind('click',function(){
				_exeAttach.te(this,opts,$tc,$shoutcut);
			});
			$('.date-area').hide();
		},
		dr:function(opts,$shoutcut,$puttype){
			this.loadTd(opts,$shoutcut,$puttype);
			_dtime.vars.signlen=0;
			_dtime.vars.ctrlsign=true;
			_dtime.vars.recordalt='';
			_dtime.vars.recordctrl='';
		},
		te:function(_this,opts,$tc,$shoutcut,$puttype){
			$(_this).hide();
			$tc.show();
			$(opts.timeparentid).show();
			$(opts.starget).attr("disabled","disabled");
			$(opts.starget).css({"color":"#ccc","cursor":"default"});
			_loadTime.load(opts,$shoutcut,$puttype);
		},
		tc:function(_this,$te,opts){
			var $this=$(_this);
			$this.hide();
			$te.show();
			$(opts.starget).attr("disabled","");
			$(opts.starget).css({"color":"#666","cursor":"pointer"});
			$(opts.timeparentid).hide();
		},
		prev:function($lObj,$rObj,opts){
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
		next:function($lObj,$rObj,opts){
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
			if($(opts.returnvalid).val()!=''){
				var $dateAreaObj=$('.date-area');
				var $lObj=$dateAreaObj.find('table').eq(0);
				var $rObj=$dateAreaObj.find('table').eq(1);
				var readDate=_dtime.vars.readDate=[];
				var readjson=eval('('+$(opts.returnvalid).val()+')');
				$.each(readjson,function(i,p){
					readDate.push(_cutsign(i,'-','/'));
				});
				var _first=_returnymd(readDate[0]);
				var _last=_returnymd(readDate[readDate.length-1]);
				var _oy=_first.m+1==11?_first.y+1:_first.y;
				var _om=_first.m+1==11?0:_first.m;
				_loadMonth($lObj,opts,readDate,_first.y,_first.m);
				_loadMonth($rObj,opts,readDate,_first.y,_first.m+1);
			}		
		},
		addsed:function($td,_get){
			if($td.text()!=''){
				$td.attr('class','');
				$td.addClass(_dtime.css.selected);
			}
			_dtime.vars.readDate.push(_get);
		},
		delsed:function($td,_get){
			if($td.text()!=''){
				$td.attr('class','');
				$td.addClass(_dtime.css.altopt);
				var _index=$.inArray(_get,_dtime.vars.readDate);
				if(_index!=-1)_dtime.vars.readDate[_index]='';
			}
		}
	},
	/*---load times---*/
	_loadTime={
		_weeklen:0,
		_index:0,
		_darray:[],
		_frontlen:0,
		_afterlen:0,
		_time:null,
		_week:null,
		_shortmark:false,
		_timejson:null,
		_daylen:0,
		_alldaylen:0,
		_alldate:[],
		load:function(opts,$shoutcut,$puttype){
			var $this=this;
			$this._weeklen=0;
			$this._index=0;
			$this._darray=[];
			$this._alldate=[];
			$this._frontlen=0;
			$this._afterlen=0;
			$this._time=null;
			$this._week=null;
			$this._shortmark=false;
			$this._timejson=null;
			$this._timejson=eval('('+$(opts.returnvalid).val()+')');
			$this._time=$(_dtime.id.loadTime.obj);
			$this._week=$(_dtime.id.loadWeek.obj);
			var _allday=true;
			$.each($this._timejson,function(i,p){
				$this._darray.push(i);
			});
			
			$('input[name=slimit][value='+$shoutcut.val()+']')[0].checked=true;
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
		right:function(opts){
			var $this=this;
			if($this._weeklen-1>$this._index){
				$this._index++;
				$this.timedate($this._index);
			}
		},
		left:function(opts){
			var $this=this;
			if($this._index>0){
				$this._index--;
				$this.timedate($this._index);
			}
		},
		timedate:function(_index){
			var _dateArr=[];
			var $this=this;
			var _start=parseInt(_index)*7;
			var _end=_start+6;
			for(var i=_start;i<=_end;i++){
				_dateArr.push($this._alldate[i]);
			}
			createElm.timeTd(_dateArr,$this._timejson,$this._time);
			createElm.weekDl(_dateArr,$this._timejson,$this._week);
		},
		slimit:function(_othis,opts){
			var $this=this;
			var no=_dtime.css.canceltime;
			var yes=_dtime.css.selectedtime;
			var $no=$this._time.find('li a.cancel-time');
			var $week6no=$this._time.find('li a[week=6].'+no);
			var $week7no=$this._time.find('li a[week=0].'+no);
			var $week6yes=$this._time.find('li a[week=6].'+yes);
			var $week7yes=$this._time.find('li a[week=0].'+yes);
			var $workno=$this._time.find('li a[week!=0][week!=6].'+no);
			var $workyes=$this._time.find('li a[week!=0][week!=6].'+yes);
			switch(_othis.value*1){
				case 0:
					$no.removeClass(no).addClass(yes);
					$this.alltimes();
					break;
				case 1:
					$workno.removeClass(no).addClass(yes);
					$week6yes.removeClass(yes).addClass(no);
					$week7yes.removeClass(yes).addClass(no);
					$this.onlywork();
					break;
				case 2:
					$workyes.removeClass(yes).addClass(no);
					$week6no.removeClass(no).addClass(yes);
					$week7no.removeClass(no).addClass(yes);
					$this.onlyweek();
					break;
			}
		},
		alltimes:function(){
			var $this=this;
			$.each($this._timejson,function(i,p){
				$this._timejson[i]=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
			});
		},
		onlywork:function(){
			var $this=this;
			$.each($this._timejson,function(i,p){
				var _week=new Date(_cutsign(i,'-','/')).getDay();
				if(_week==0||_week==6){
					$this._timejson[i]=[];
				}else{
					$this._timejson[i]=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
				}
			});
		},
		onlyweek:function(){
			var $this=this;
			$.each($this._timejson,function(i,p){
				var _week=new Date(_cutsign(i,'-','/')).getDay();
				if(_week!=0&&_week!=6){
					$this._timejson[i]=[];
				}else{
					$this._timejson[i]=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
				}
			});
		},
		timeper:function(_this){
			var $_this=$(_this);
			var $this=this;
			var _alt=$_this.attr('alt');
			var _index=$_this.attr('index');
			if($_this.hasClass(_dtime.css.canceltime)){
				$_this.removeClass(_dtime.css.canceltime).addClass(_dtime.css.selectedtime);
				$this._timejson[_alt].push(_index);
			}else{
				$_this.addClass(_dtime.css.canceltime).removeClass(_dtime.css.selectedtime);
				$this._timejson[_alt][_index]='25';
			}
		},
		cutovertip:function(_this){
			var $_this=$(_this);
			var $this=this;
			var _alt=$_this.parent().attr('alt');
			var $alt=$('li a[alt='+_alt+']');
			var _num=0;
			$alt.each(function(){
				var $this=$(this);
				if($this.hasClass(_dtime.css.selectedtime)){
					_num=_num+1;
				}
			});
			if(_num==24){
				$alt.removeClass(_dtime.css.selectedtime).addClass(_dtime.css.canceltime);
				$this._timejson[_alt]=[];
			}else{
				$alt.removeClass(_dtime.css.canceltime).addClass(_dtime.css.selectedtime);
				$this._timejson[_alt]=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
			}
		},
		timesubmit:function(opts,$te,$tc,$puttype,$shoutcut){
			var $this=this;
			var alltime=[];
			var puttype=false;
			var _limit=$('input[name=slimit]:checked').val();
			alltime.push('{');
			$.each($this._timejson,function(i,p){
				if(p.length==0||p.length<24){
					puttype=true;
				}
				if($.inArray('25',p)!=-1){
					var _str=p.sort($this.sortNumber).join(',');
					$this._timejson[i]=_cutsign(_str,'25,','').split(',');
					$this._timejson[i].pop();
					if($this._timejson[i].length<24){
						puttype=true;
					}
					alltime.push('"'+i+'":['+$this._timejson[i]+'],');
				}else{
					alltime.push('"'+i+'":['+p.sort($this.sortNumber)+'],');
				}
			});
			$(opts.returnvalid).val(alltime.join('').substring(0,alltime.join('').lastIndexOf(','))+'}');
			$(opts.starget).attr("disabled","");
			$(opts.starget).css({"color":"#666","cursor":"pointer"});
			$shoutcut.val(_limit);
			if(puttype){
				$puttype.text(_dtime.tip.time);        
			}else{
				$puttype.text(_dtime.tip.allday);
			}
			$(opts.timeparentid).hide();
			$te.show();
			$tc.hide();
		},
		sortNumber:function(a,b){
			return a-b;
		}
	},
	/*---load month---*/
	_loadMonth=function(_obj,_opts,_readDate,_y,_m){
		var date=[];
		var _daystr=new Date(_y,2,0).getDate() == 29?'31,29,31,30,31,30,31,31,30,31,30,31'.split(','):'31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
		var _days=_daystr[_m];
		var _index=new Date(_y,_m,1).getDay();
		var _cells=$(_obj).find('td').attr('class','').text('').removeAttr('alt').unbind('click').unbind('mouseenter mouseleave');
		$("select[name=month]", _obj).get(0).selectedIndex = _m;
		$("select[name=year]", _obj).get(0).selectedIndex = Math.max(0, _y - _opts.sdate);
		$("h5[alt=readDate]",_obj).text(_returnFormat(new Date(_y,_m,1),'/'));
		for(var i=0;i<_days;i++){
			var _cell = jQuery(_cells.get(i + _index));
			var _cur=_y+'/'+_returnTwo(_m*1+1)+'/'+_returnTwo(i+1);
			_cell.text(i+1).attr('alt',_cur);
			if((new Date(_y,_m,i+1).getTime()>new Date(_readDate[0]).getTime())&&(new Date(_y,_m,i+1).getTime()<new Date(_readDate[_readDate.length-1]).getTime())){
				if($.inArray(_cur,_readDate)!=-1){
					_cell.addClass(_dtime.css.selected);
				}else{
					_cell.addClass(_dtime.css.altopt);
				}
			}
			if(new Date(_y,_m,i+1).getTime()==new Date(_readDate[0]).getTime()||new Date(_y,_m,i+1).getTime()==new Date(_readDate[_readDate.length-1]).getTime()){
				_cell.addClass(_dtime.css.timesign);
			}
			if(new Date(_y,_m,i+1).getTime()<_returnTodayGetTime()){
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
			if(_selected){
				$(_this).removeClass(_dtime.css.selected);
				$(_this).addClass(_dtime.css.altopt);
				var _alt=$(_this).attr('alt');
				var _index=$.inArray(_alt,_dtime.vars.readDate);
				if(_index!=-1)_dtime.vars.readDate[_index]='';
				_dtime.vars.recordalt=_alt;
			}else if(_altopt){
				$(_this).addClass(_dtime.css.selected);
				$(_this).removeClass(_dtime.css.altopt);
				var _alt=$(_this).attr('alt');
				var _cache=_dtime.vars.readDate[_dtime.vars.readDate.length-1];
				_dtime.vars.readDate[_dtime.vars.readDate.length-1]='';
				_dtime.vars.readDate.push(_alt);
				_dtime.vars.readDate.push(_cache);
			}
		}else if(e.ctrlKey){  /*---ctrl key---*/
			if(_selected){
				if(_dtime.vars.recordalt!=''){
					var _first=_dtime.vars.recordalt;
					var _last=$(_this).attr('alt');
					$(_this).removeClass(_dtime.css.selected);
					$(_this).addClass(_dtime.css.altopt);
					var _index=$.inArray(_last,_dtime.vars.readDate);
					if(_index!=-1)_dtime.vars.readDate[_index]='';
					_tdSign(_first,_last,_exeAttach.delsed,true);
				}else{
					var _alt=$(_this).attr('alt');
					$(_this).removeClass(_dtime.css.selected);
					$(_this).addClass(_dtime.css.altopt);
					var _index=$.inArray(_alt,_dtime.vars.readDate);
					if(_index!=-1)_dtime.vars.readDate[_index]='';
					if(_dtime.vars.ctrlsign){
						_dtime.vars.recordctrl=_alt;
						_dtime.vars.ctrlsign=false;
					}else{
						var _first=_dtime.vars.recordctrl;
						var _last=$(_this).attr('alt');
						_tdSign(_first,_last,_exeAttach.delsed,true)
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
							var $td=$table.find('td[alt='+_get+']');
							if($td.text()!=''){
								$td.attr('class','');
								if(i==_days-1){
									$td.addClass(_dtime.css.timesign);
								}else{
									$td.addClass(_dtime.css.selected);
								}
							}
							_dtime.vars.readDate.push(_get);
						}
					}
					if(!_prev){
						$table.find('td[alt='+_dtime.vars.readDate[0]+']').attr('class',_dtime.css.timesign);
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
							var $td=$table.find('td[alt='+_get+']');
							if($td.text()!=''){
								$td.attr('class','');
								if(i==_days-1){
									$td.addClass(_dtime.css.timesign);
								}else{
									$td.addClass(_dtime.css.selected);
								}
							}
							_dtime.vars.readDate.unshift(_get);
						}
					}
					if(!_next){
						$table.find('td[alt='+_dtime.vars.readDate[_dtime.vars.readDate.length-1]+']').attr('class',_dtime.css.timesign);
						_dtime.vars.signlen++;
						_dtime.vars.ctrlsign=true;
						_dtime.vars.recordalt='';
						_dtime.vars.recordctrl='';
					}
				}
			}
		}else{   /*---normal---*/
			$alltd=$('.date-control table td');
			if(_dtime.vars.signlen==1&&!_timesign){  //sign
				var _first=_dtime.vars.readDate[0];
				_dtime.vars.readDate=[];
				var _last=$(_this).attr('alt');
				$(_this).addClass(_dtime.css.timesign);
				_tdSign(_first,_last,_exeAttach.addsed);
				_dtime.vars.signlen++;
			}else{  //reset
				$alltd.removeClass(_dtime.css.selected);
				$alltd.removeClass(_dtime.css.timesign);
				$alltd.removeClass(_dtime.css.altopt);
				$(_this).addClass(_dtime.css.timesign);
				_dtime.vars.readDate=[];
				_dtime.vars.readDate.push($(_this).attr('alt'));
				_dtime.vars.signlen=1;
				_dtime.vars.recordalt='';
				_dtime.vars.recordctrl='';
				_dtime.vars.ctrlsign=true;
			}
		}
	},
	/*---date per sign---*/
	_tdSign=function(_first,_last,_call,_nowrite){
		if(new Date(_last).getTime()<new Date(_first).getTime()){
				var _cache=_first;
				_first=_last;
				_last=_cache;
		}
		var _days=_returnDays(_first,_last);
		var _oneDay=24*60*60*1000;
		var $table=$('.date-control table');
		if(!_nowrite){
			_dtime.vars.readDate.push(_first);
		}
		for(var i=1;i<_days;i++){
			var _cur=new Date(_first).getTime()+_oneDay*i;
			if(_cur<new Date(_last)&&_cur>new Date(_first)){
				var _get=_returnFormat(_cur,'/');
				var $td=$table.find('td[alt='+_get+']');
				_call($td,_get);
			}
		}
		if(!_nowrite){
			_dtime.vars.readDate.push(_last);
		}
	},
	_setPutType=function(opts,$puttype){
		var _timejson=eval('('+$(opts.returnvalid).val()+')');
		var _allday=true;
		$.each(_timejson,function(i,p){
			if(p==''||p.length!=24){
				_allday=false;
			}
		});
		if(_allday){
			$puttype.text(_dtime.tip.allday);
		}else{
			$puttype.text(_dtime.tip.time);
		}
	}
	var _timeable=createElm.table();
})(jQuery);