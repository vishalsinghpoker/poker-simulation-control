//$(document).ready(function(){
    pnlAlert = $(".modal-wrapper");
    pnlAlert.titlemsg = $(".modal-wrapper .modal-title");
    pnlAlert.msg = $(".modal-wrapper .modal-message p");
    let validateForm = true,
    //player count start from 3 as two player statically added
    count = 3;
    // Finding total number of elements added
    var totalPlayer = $("#player_data .form_group").length;
    $("#addPlayer").click(function(){
        let maxPlayerInput = 8;
        var cloneData = `<div class="form_group form_row">
        <div class="form_td"><input type="text" name="player_name_${count}" id="player_name_${count}" value="player ${count}"/></div>
        <div class="form_td"><input type="number" name="player_seat_${count}" id="player_seat_${count}" value="${count}" /></div>
        <div class="form_td"><input type="number" name="player_chips_${count}" id="player_chips_${count}" /></div>
        <div class="form_td"><input type="text" name="player_cards_${count}" id="player_cards_${count}" /></div>
        <div class="form_td"><button class="remove_player" title="Remove Player" type="button">&#10005;</button></div>
        </div>`;
        // increment counter on click add player
        count++;

        if(totalPlayer < maxPlayerInput ){
            $("#player_data").append(cloneData);
            playerSelectFn();
        } else{
            openModal('Alert', 'Max. Player Limit reached');
        }
    })
    
    //remove player
    $(document).on('click','.remove_player',function(){
        $(this).closest(".form_group").remove();
        totalPlayer = $("#player_data .form_group").length;
        playerSelectFn();
        // reset counter if no appended element left
        if(totalPlayer === 2){
            count = 3;
        }
    });
    
    // form data capture on input
    $(document).on('#form input', function(){
        var data = JSON.stringify( $('#form').serializeArray() );
        console.log(data);
    })

    // accordian - Custom accordian
    $(".accordian_body:first,.accordian_title:first").addClass("show active");
    $(".accordian_body:not(:first)").hide();
    $(".accordian_title").on('click',function(){
        if($(this).hasClass('active')){
            let $this = $(this);
            if ($this.hasClass("show")) {
                $this.removeClass("show");
                $this.next().slideUp(200);
            } else {
                $(".accordian_title").removeClass("show");
                $this.addClass("show");
                $(".accordian_body").slideUp(200);
                $this.next().slideDown(200);
            }
        }
	});

    // Tabs active
    var tabs = $('.main_wrapper').find('.tabs');
    if(tabs.is(':visible')) {
        $('.tabs a').click( function(event){
            event.preventDefault();
            var target = $(this).attr('href'),
                tabs = $(this).parents('.tabs'),
                buttons = tabs.find('a'),
                item = tabs.parents('.main_wrapper').find('.tab_item');
            buttons.removeClass('active');
            item.removeClass('active');
            $(this).addClass('active');
            $(target).addClass('active');
        })
    } else{
        $('.tab_item').on('click', function() {
            var container = $(this).parents('.main_wrapper'),
                currId = $(this).attr('id'),
                items = container.find('.item');
            container.find('.tabs a').removeClass('active');
            items.removeClass('active');
            $(this).addClass('active');
            container.find('.tabs a[href$="#'+ currId +'"]').addClass('active');
        })
    }

    // next button listener
    $('.next_state').on('click', function() {
        validateForm = true,
            message = '';
    
        $('form input').each(function() {
            var $this = $(this);
    
            if(!$this.val()) {
                var inputName = $this.attr('name');
                validateForm = false;
                $this.addClass('invalid');
                message += 'Please enter your ' + inputName + '\n';
            } else{
                $this.removeClass('invalid');
            }
        });
    
        if(!validateForm) {
            openModal('Alert', 'Please fill the required Data');
        } else{
            //on valid form(trigger next)
            $(this).closest('.accordian_inner').next().find('.accordian_title').addClass('active').trigger('click');
            //getting player data if player details available and filled in next step
            var player_data='';
            $('form input[name^="player_name"]').each( function(){
                var input_id = $(this).attr('id');
                var input_val = $(this).val();
                player_data += 
                `<div class="form_group form_row">
                    <div class="form_td">
                        <div class="player_name" id=${input_id}>${input_val}</div>
                    </div>
                    <div class="form_td game_action">
                        <button class="btn btn-danger">fold</button>
                        <button class="btn btn-primary">check</button>
                        <button class="btn btn-warning">call</button>
                        <button class="btn btn-success">raise</button>
                    </div>
                </div>`;
            });
            var playerHead = ` <div class="form_title form_row">
                <div class="title">Player Name</div>
                <div class="title">Action</div>
            </div>`;
            $('.player_data').html(playerHead + player_data);
            // add dealer position class in pre-flop step
            var dealerPosition = parseInt($('#dealerPosition').val());
            if(dealerPosition){
                $(`.player_data #player_name_${dealerPosition}`).addClass('dl');

                var totalPlayer = $("#player_data .form_group").length;
                if (dealerPosition == totalPlayer) {
                    $(`.player_data #player_name_1`).addClass('sb');
                    $(`.player_data #player_name_2`).addClass('bb');
                } else if (dealerPosition == totalPlayer - 1) {
                    $(`.player_data #player_name_${(dealerPosition+1)}`).addClass('sb');
                    $(`.player_data #player_name_1`).addClass('bb');
                } else {
                    $(`.player_data #player_name_${(dealerPosition+1)}`).addClass('sb');
                    $(`.player_data #player_name_${(dealerPosition+2)}`).addClass('bb');
                }
            }
        }
    });

    //flop action
    $(document).on('click','.game_action .btn', function(event){
        var $this = $(this);
        var text=$(event.target).text();
        if(text === 'fold'){
           $this.closest('.game_action').find('.btn').attr('disabled', true);
        } 
    });
    // auto double the bb amount on input sb
    $('#sbInput').on('input', function(event){
        var eventVal = $(this).val();
        $('#bbInput').val(eventVal * 2)
    })
    
    
//})
// check player seat duplicay
$(document).on('change','input[name^="player_seat"]',function() {
    var $current = $(this);
    //debugger;
    $('input[name^="player_seat"]').each(function() {
        if ($(this).val() == $current.val() && $(this).attr('id') != $current.attr('id'))
        {
            openModal('Alert', 'Duplicate Player Seat found!');
            $current.val('');
            validateForm = false;
        } else if($(this).val() < 1 || $(this).val() > 8){
            openModal('Alert', 'Player Seat should be in between 1 to 8');
            $(this).val('');
        }

    })
  });
//chose dealer position
function playerSelectFn(){
    let playerSelectOptions='';
    $('form input[name^="player_seat"]').each( function(i){
        var id = $(this).attr('id').replace(/player_seat_/, '');
        playerSelectOptions += `<option value='${id}'>${id}</option>`;
    });
    $('#dealerPosition').html(playerSelectOptions);
}

$('#dealerPosition').on('select', function(){
    playerSelectFn();
})

//popup close
$('.close-modal').on('click', function(){
    $('.modal-wrapper').fadeOut();
})

function openModal(title, message){
    if(title){
        pnlAlert.show('slow');
        pnlAlert.titlemsg.text(title);
        pnlAlert.msg.text(message);
    }
}
 
function closeModal(){
    pnlAlert.hide('slow');
}

