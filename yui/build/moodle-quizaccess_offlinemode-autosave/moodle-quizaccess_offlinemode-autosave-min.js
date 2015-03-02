YUI.add("moodle-quizaccess_offlinemode-autosave",function(e,t){M.quizaccess_offlinemode=M.quizaccess_offlinemode||{},M.quizaccess_offlinemode.autosave={TINYMCE_DETECTION_DELAY:500,TINYMCE_DETECTION_REPEATS:20,WATCH_HIDDEN_DELAY:1e3,SAVE_TIMEOUT:3e4,SELECTORS:{QUIZ_FORM:"#responseform",VALUE_CHANGE_ELEMENTS:'input, textarea, [contenteditable="true"]',CHANGE_ELEMENTS:"input, select",HIDDEN_INPUTS:"input[type=hidden]",NAV_BUTTON:"#quiznavbutton",QUESTION_CONTAINER:"#q",STATE_HOLDER:" .state",SUMMARY_ROW:".quizsummaryofattempt tr.quizsummary",STATE_COLUMN:" .c1",FINISH_ATTEMPT_INPUT:"input[name=finishattempt]",SUBMIT_BUTTON:"input[type=submit]",FORM:"form",SAVING_NOTICE:"#quiz-saving",LAST_SAVED_TIME:"#quiz-last-saved",SAVE_FAILED_NOTICE:"#mod_quiz_navblock .quiz-save-failed"},AUTOSAVE_HANDLER:M.cfg.wwwroot+"/mod/quiz/accessrule/offlinemode/autosave.ajax.php",RELOGIN_SCRIPT:M.cfg.wwwroot+"/mod/quiz/accessrule/offlinemode/relogin.php",delay:12e4,form:null,dirty:!1,delay_timer:null,save_transaction:null,last_successful_save:null,editor_change_handler:null,hidden_field_values:{},init:function(t){this.form=e.one(this.SELECTORS.QUIZ_FORM);if(!this.form)return;M.core_question_engine.init_form(e,this.SELECTORS.QUIZ_FORM),e.on("submit",M.mod_quiz.timer.stop,this.SELECTORS.QUIZ_FORM),window.onbeforeunload=e.bind(this.warn_if_unsaved_data,this),this.delay=t*1e3,this.form.delegate("valuechange",this.value_changed,this.SELECTORS.VALUE_CHANGE_ELEMENTS,this),this.form.delegate("change",this.value_changed,this.SELECTORS.CHANGE_ELEMENTS,this);var n=e.one(this.SELECTORS.FINISH_ATTEMPT_INPUT).previous(this.SELECTORS.SUBMIT_BUTTON);n.detach("click"),n.on("click",this.submit_and_finish_clicked,this),this.create_status_messages(),this.init_tinymce(this.TINYMCE_DETECTION_REPEATS),this.save_hidden_field_values(),this.watch_hidden_fields()},save_hidden_field_values:function(){this.form.all(this.SELECTORS.HIDDEN_INPUTS).each(function(e){var t=e.get("name");if(!t)return;this.hidden_field_values[t]=e.get("value")},this)},watch_hidden_fields:function(){this.detect_hidden_field_changes(),e.later(this.WATCH_HIDDEN_DELAY,this,this.watch_hidden_fields)},detect_hidden_field_changes:function(){this.form.all(this.SELECTORS.HIDDEN_INPUTS).each(function(e){var t=e.get("name"),n=e.get("value");if(!t||t==="sesskey")return;if(!(t in this.hidden_field_values)||n!==this.hidden_field_values[t])this.hidden_field_values[t]=n,this.value_changed({target:e})},this)},init_tinymce:function(t){if(typeof tinyMCE=="undefined"){t>0&&e.later(this.TINYMCE_DETECTION_DELAY,this,this.init_tinymce,[t-1]);return}this.editor_change_handler=e.bind(this.editor_changed,this),tinyMCE.onAddEditor.add(e.bind(this.init_tinymce_editor,this))},init_tinymce_editor:function(e,t){t.onChange.add(this.editor_change_handler),t.onRedo.add(this.editor_change_handler),t.onUndo.add(this.editor_change_handler),t.onKeyDown.add(this.editor_change_handler)},value_changed:function(e){var t=e.target.getAttribute("name");if(t==="thispage"||t==="scrollpos"||t&&t.match(/_:flagged$/))return;t=t||"#"+e.target.getAttribute("id"),this.start_save_timer_if_necessary(),this.mark_question_changed_if_necessary(t)},editor_changed:function(e){this.start_save_timer_if_necessary(),this.mark_question_changed_if_necessary(e.id)},mark_question_changed_if_necessary:function(e){var t=this.get_slot_from_id(e);t&&(this.set_question_state_string(t,M.util.get_string("answerchanged","quizaccess_offlinemode")),this.set_question_state_class(t,"answersaved"))},get_slot_from_id:function(e){var t=e.match(/^#?q\d+:(\d+)_.*$/);return t?t[1]:undefined},set_question_state_string:function(t,n){e.one(this.SELECTORS.QUESTION_CONTAINER+t+this.SELECTORS.STATE_HOLDER).setHTML(e.Escape.html(n));var r=e.one(this.SELECTORS.SUMMARY_ROW+t+this.SELECTORS.STATE_COLUMN);r&&r.setHTML(e.Escape.html(n)),e.one(this.SELECTORS.NAV_BUTTON+t).set("title",e.Escape.html(n))},update_question_state_strings:function(t){e.Object.each(t,function(e,t){this.set_question_state_string(t,e)},this)},set_question_state_class:function(t,n){var r=e.one(this.SELECTORS.NAV_BUTTON+t);r.set("className",r.get("className").replace(/^qnbutton \w+\b/,"qnbutton "+e.Escape.html(n)))},update_question_state_classes:function(t){e.Object.each(t,function(e,t){this.set_question_state_class(t,e)},this)},start_save_timer_if_necessary:function(){this.dirty=!0;if(this.delay_timer||this.save_transaction)return;this.start_save_timer()},start_save_timer:function(){this.cancel_delay(),this.delay_timer=e.later(this.delay,this,this.save_changes)},cancel_delay:function(){this.delay_timer&&this.delay_timer!==!0&&this.delay_timer.cancel(),this.delay_timer=null},save_changes:function(){this.cancel_delay(),this.dirty=!1;if(this.is_time_nearly_over()){this.stop_autosaving();return}typeof tinyMCE!="undefined"&&tinyMCE.triggerSave(),this.save_transaction=e.io(this.AUTOSAVE_HANDLER,{method:"POST",form:{id:this.form},on:{success:this.save_done,failure:this.save_failed},context:this,timeout:this.SAVE_TIMEOUT}),e.one(this.SELECTORS.SAVING_NOTICE).setStyle("visibility","visible")},save_done:function(t,n){var r;try{r=e.JSON.parse(n.responseText)}catch(i){this.save_failed(t,n);return}if(r.result==="lostsession"){this.save_transaction=null,this.dirty=!0,this.try_to_restore_session();return}if(r.result!=="OK"){this.save_failed(t,n);return}this.save_transaction=null,this.update_status_for_successful_save(),this.update_question_state_classes(r.questionstates),this.update_question_state_strings(r.questionstatestrs),this.dirty&&this.start_save_timer()},save_failed:function(){this.save_transaction=null,this.update_status_for_failed_save(),this.dirty=!0,this.start_save_timer()},is_time_nearly_over:function(){return M.mod_quiz.timer&&M.mod_quiz.timer.endtime&&(new Date).getTime()+2*this.delay>M.mod_quiz.timer.endtime},stop_autosaving:function(){this.cancel_delay(),this.delay_timer=!0,this.save_transaction&&this.save_transaction.abort()},warn_if_unsaved_data:function(e){if(!this.dirty&&!this.save_transaction
)return;return e.returnValue=M.util.get_string("changesmadereallygoaway","moodle"),e.returnValue},submit_and_finish_clicked:function(e){e.halt(!0);var t=new M.core.confirm({id:"submit-confirmation",width:"300px",center:!0,modal:!0,visible:!1,draggable:!1,title:M.util.get_string("confirmation","admin"),noLabel:M.util.get_string("cancel","moodle"),yesLabel:M.util.get_string("submitallandfinish","quiz"),question:M.util.get_string("confirmclose","quiz")});t.on("complete-yes",this.submit_and_finish,this),t.render().show()},submit_and_finish:function(t){t.halt(),this.stop_autosaving();var n=e.one("input[name=finishattempt]").previous("input[type=submit]");this.get_submit_progress(n.ancestor(".controls")).show(),n.ancestor(".singlebutton").hide();var r=this.get_submit_failed_message(n.ancestor(".controls"));n.ancestor(".controls").removeClass("quiz-save-failed"),r.header.hide(),r.message.hide(),this.form.append('<input name="finishattempt" value="1">'),typeof tinyMCE!="undefined"&&tinyMCE.triggerSave(),this.save_transaction=e.io(this.AUTOSAVE_HANDLER,{method:"POST",form:{id:this.form},on:{success:this.submit_done,failure:this.submit_failed},context:this,timeout:this.SAVE_TIMEOUT})},submit_done:function(t,n){var r;try{r=e.JSON.parse(n.responseText)}catch(i){this.submit_failed(t,n);return}if(r.result!=="OK"){this.submit_failed(t,n);return}this.save_transaction=null,this.dirty=!1,window.location.replace(r.reviewurl)},submit_failed:function(){this.save_transaction=null,this.form.one(this.SELECTORS.FINISH_ATTEMPT_INPUT).remove();var t=e.one(this.SELECTORS.FINISH_ATTEMPT_INPUT).previous("input[type=submit]"),n=this.get_submit_progress(t.ancestor(".controls"));t.ancestor(".singlebutton").show(),n.hide();var r=this.get_submit_failed_message(t.ancestor(".controls"));t.ancestor(".controls").addClass("quiz-save-failed"),r.header.show(),r.message.show(),this.update_status_for_failed_save()},get_submit_progress:function(t){var n=t.one(".submit-progress");return n?n:(n=t.appendChild('<div class="submit-progress">'),M.util.add_spinner(e,n).show(),n.append(M.util.get_string("submitting","quizaccess_offlinemode")),n)},get_submit_failed_message:function(e){var t=e.one(".submit-failed-header");if(t)return{header:t,message:e.one(".submit-failed-message")};e.insert('<div class="submit-failed-header">',0),t=e.one(".submit-failed-header"),t.append("<h4>"+M.util.get_string("submitfailed","quizaccess_offlinemode")+"</h4>"),t.append("<p>"+M.util.get_string("submitfailedmessage","quizaccess_offlinemode")+"</p>");var n='<a href="#" class="response-download-link">'+M.util.get_string("savetheresponses","quizaccess_offlinemode")+"</a>",r=e.appendChild('<div class="submit-failed-message">');return r.append("<p>"+M.util.get_string("submitfaileddownloadmessage","quizaccess_offlinemode",n)+"</p>"),{header:t,message:r}},create_status_messages:function(){var t='<a href="#" class="response-download-link">'+M.util.get_string("savetheresponses","quizaccess_offlinemode")+"</a>";e.one("#mod_quiz_navblock .content").append('<div id="quiz-save-status"><div>'+M.util.get_string("lastsaved","quizaccess_offlinemode",'<span id="quiz-last-saved"></span>')+"</div>"+'<div id="quiz-saving">'+M.util.get_string("savingdots","quizaccess_offlinemode")+"</div>"+'<div class="quiz-save-failed">'+M.util.get_string("savefailed","quizaccess_offlinemode",t)+"</div>"+"</div>"),this.update_status_for_successful_save()},update_status_for_successful_save:function(){function t(e){return e<10?"0"+e:e}this.last_successful_save=new Date,e.one(this.SELECTORS.LAST_SAVED_TIME).setHTML(t(this.last_successful_save.getHours())+":"+t(this.last_successful_save.getMinutes())),e.one(this.SELECTORS.SAVING_NOTICE).setStyle("visibility","hidden"),e.one(this.SELECTORS.SAVE_FAILED_NOTICE).hide()},update_status_for_failed_save:function(){e.one(this.SELECTORS.SAVING_NOTICE).setStyle("visibility","hidden"),e.one(this.SELECTORS.SAVE_FAILED_NOTICE).show()},try_to_restore_session:function(){this.loginDialogue=new M.core.notification.info({id:"quiz-relogin-dialogue",width:"70%",center:!0,modal:!0,visible:!1,draggable:!1}),this.loginDialogue.setStdModContent(e.WidgetStdMod.HEADER,'<h1 id="moodle-quiz-relogin-dialogue-header-text">'+M.util.get_string("logindialogueheader","quizaccess_offlinemode")+"</h1>",e.WidgetStdMod.REPLACE),this.loginDialogue.setStdModContent(e.WidgetStdMod.BODY,'<iframe src="'+this.RELOGIN_SCRIPT+"?userid="+e.one("#quiz-userid").get("value")+'">',e.WidgetStdMod.REPLACE),this.loginDialogue.render().show()},restore_session_complete:function(t){e.all("input[name=sesskey]").set("value",t),this.loginDialogue&&(this.loginDialogue.hide().destroy(),this.loginDialogue=null),this.save_changes()}}},"@VERSION@",{requires:["base","node","event","event-valuechange","node-event-delegate","io-form","core_question_engine","mod_quiz"]});
