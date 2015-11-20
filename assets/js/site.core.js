$(function () { 
    
    var sort_by = function(field, reverse, primer){

        var key = primer ? 
            function(x) {return primer(x[field])} : 
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        } 
    }

    $.fn.blockUI = function (options) {
        options = $.extend(true, {}, options);
        var html = '';
        if (options.animate) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
        } else if (options.iconOnly) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src=".assets/img/loading-spinner-grey.gif" align=""></div>';
        } else if (options.textOnly) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
        } else {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="assets/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
        }

        if (options.target) { // element blocking
            var el = $(options.target);
            if (el.height() <= ($(window).height())) {
                options.cenrerY = true;
            }
            el.block({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 1000,
                centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                css: {
                    top: '10%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        } else { // page blocking
            $.blockUI({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 1000,
                css: {
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        }
    }

    $.fn.unblockUI = function (timeout, target) {
        /// <summary>Realiza o desbloqueio da tela</summary>
        /// <param name="timeout" type="int">Tempo de time out [default = 1000]</param>
        timeout = (typeof timeout === 'undefined') ? 1000 : timeout;

        //Desbloqueia a tela
        window.setTimeout(function () {            
            if (target) {
                $(target).unblock({
                    onUnblock: function () {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        }, timeout);
    }
    
    $.fn.writeTeam = function (id, fileName) {
        /// <summary>Realiza a criação de chart via JSON</summary>
        /// <param name="chart" type="HighCharts">Chart</param>
        /// <param name="url" type="String">Url da requisição das séries</param>
        var deferred = $.Deferred();

        $(document).blockUI();

        $.getJSON(fileName)
        .done(function(items) {		
            var itemsOrdered = items.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
    
            var html = "";
            
            $.each(itemsOrdered, function(index, item) {
                html = html + 
                        "<div class='message-item'>"+
                            "<div class='message-inner'>"+
                                "<div class='message-head clearfix'>"+
                                    "<div class='avatar pull-left'><img src='" + item.image + "' class='img-thumbnail img-responsive'></div>"+
                                    "<div class='user-detail'>"+
                                        "<h5 class='handle'>" + item.name + "</h5>"+
                                        "<div class='post-meta'>"+
                                            "<div class='asker-meta'>"+
                                                "<span class='qa-message-what'>" + item.detail + "</span>"+
                                                "<br />"+
                                            "</div>";
                                                    
                                            if( item.lattes!= "")
                                            {
                                                html = html + 
                                                "<span class='qa-message-who'>"+
                                                    "<span class='qa-message-who-data'><a href='"+ item.lattes + "' target='_blank'><img src='images/lattes2.png' alt='Lattes' border='0'></a></span>"+
                                                "</span>";
                                            }
                html = html + 
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='qa-message-content'>" +
                                        item.description +
                                "</div>"+
                            "</div>"+
                        "</div>";
            });	
                        
            $("#"+ id).append(html);
            $(document).unblockUI();
            deferred.resolve();
        })
        .fail(function(jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
            
            $(document).unblockUI();
            deferred.reject(err);
        });
               
        return deferred.promise();
    }
});