$(document).ready(function($) {

    $('.Screen').hide();

    var LocalstorageName = 'TodoManager';

    $(document).on('click', '.BTN_Add_New', function(event) {

        var GetTemplateData = $('.Template_New_Todo').html();

        $('.Screen_Data').html(GetTemplateData);
        $('.Screen_Data').find('.btn_Todo').html('Save').addClass('BTN_Save_New_Todo')
        $('.Screen_Data').show();
    });


    $('.Screen_Data').on('click', '.BTN_Save_New_Todo', function(event) {

        bs.ClearError();
        var TodoName = $('.Screen_Data').find('.TodoName');
        var TodoDate = $('.Screen_Data').find('.TodoDate');
        var TodoDesc = $('.Screen_Data').find('.TodoDesc');

        if (frm.IsEmpty(TodoName.val())) {
            bs.ShowError("Please enter Todo Name", TodoName)
        } else if (frm.IsEmpty(TodoDate.val())) {
            bs.ShowError("Please enter Todo Completion Date", TodoDate)
        } else if (frm.IsEmpty(TodoDesc.val())) {
            bs.ShowError("Please enter Todo description", TodoDesc)
        } else {
            var AddTodo = {
                'rec_id': js.MD5('', 6),
                'TodoName': TodoName.val(),
                'TodoDate': TodoDate.val(),
                'TodoDesc': TodoDesc.val(),
            };

            ls.AddArr(LocalstorageName, AddTodo);

            var d = bs.AlertMsg("Successfully add your new todo", "success");
            $('.Screen_Data').html(d);

            $(".BTN_View").click();
        }


    });

    $(document).on('click', '.BTN_View', function(event) {

        var AllTodos = ls.GetAllArr(LocalstorageName);


        if (js.Size(AllTodos) < 1 || js.Size(AllTodos) == 0) {
            var d = bs.AlertMsg("Oppps...Looks like there are no todos. <br><br> You should add a todo first", "warning");
            $('.Screen_Data').html(d).show();
            return false;
        }

        var strTableData = '';
        strTableData += '<table class="table table-hover">';
        strTableData += '<thead>';
        //strTableData += '<tr>';
        strTableData += '<th>Line Num</th>';
        strTableData += '<th>Todo Name</th>';
        strTableData += '<th>Todo Date</th>';
        strTableData += '<th>Todo Desc</th>';
        strTableData += '<th>Options</th>';
        //strTableData += '</tr>'; 		
        strTableData += '</thead>';


        strTableData += '<tbody>'
        for (var i = 0; i < AllTodos.length; i++) {
            var val = AllTodos[i];
            var line_num = i + 1;

            strTableData += '<tr>';
            strTableData += '<td>' + line_num + '</td>';
            strTableData += '<td>' + val.TodoName + '</td>';
            strTableData += '<td>' + moment(val.TodoDate).format('M-D-Y') + '</td>';
            strTableData += '<td>' + val.TodoDesc + '<td>';

            var Edit = '<a href="#" class="BTN_Edit_Entry" rec_id="' + val.rec_id + '">Edit</a> / ';
            var Delete = '<a href="#" class="BTN_Delete_Entry" rec_id="' + val.rec_id + '" todo_name="' + val.TodoName + '">Delete</a>';

            strTableData += '<td>' + Edit + Delete + '<td>';
            strTableData += '</tr>';

        };
        strTableData += '<tbody>'
        strTableData += '</table>';

        $('.Screen_Data').html(strTableData).show();

    });

    $(document).on('click', '.BTN_Edit_Entry', function(event) {
        var rec_id = $(this).attr('rec_id');


        var GetTemplateData = $('.Template_New_Todo').html();

        $('.Screen_Data').html(GetTemplateData);
        $('.Screen_Data').find('.btn_Todo').html('Update').addClass('BTN_Update_Todo');
        $('.Screen_Data').find('.btn_Todo').attr('rec_id', rec_id);


        var WhereValueEquals = { rec_id: rec_id }

        var data = ls.GetArr(LocalstorageName, WhereValueEquals)

        console.table(data);


        var TodoName = $('.Screen_Data').find('.TodoName').val(data[0].TodoName);
        var TodoDate = $('.Screen_Data').find('.TodoDate').val(data[0].TodoDate);
        var TodoDesc = $('.Screen_Data').find('.TodoDesc').val(data[0].TodoDesc);

        $('.Screen_Data').show();
    });

    //Update todo
    $('.Screen_Data').on('click', '.BTN_Update_Todo', function(event) {
        //To clear all old alerts
        bs.ClearError();

        //Get values
        var TodoName = $('.Screen_Data').find('.TodoName');
        var TodoDate = $('.Screen_Data').find('.TodoDate');
        var TodoDesc = $('.Screen_Data').find('.TodoDesc');

        if (frm.IsEmpty(TodoName.val())) {
            bs.ShowError("Please enter Todo Name", TodoName)
        } else if (frm.IsEmpty(TodoDate.val())) {
            bs.ShowError("Please enter Todo Completion Date", TodoDate)
        } else if (frm.IsEmpty(TodoDesc.val())) {
            bs.ShowError("Please enter Todo description", TodoDesc)
        } else {
            var rec_id = $(this).attr('rec_id');

            var FieldObjArrToUpdatValue = {
                'TodoName': TodoName.val(),
                'TodoDate': TodoDate.val(),
                'TodoDesc': TodoDesc.val(),
            };

            var WhereObjArr = { 'rec_id': rec_id }

            ls.UpdateArr(LocalstorageName, FieldObjArrToUpdatValue, WhereObjArr)

            var d = bs.AlertMsg("Successfully update your todo", "success");
            $('.Screen_Data').html(d);

            $(".BTN_View").click();
        }


    });

    $(document).on('click', '.BTN_Delete_Entry', function(event) {
        var rec_id = $(this).attr('rec_id');
        var todo_name = $(this).attr('todo_name');

        var ObjArrOptions = {
            text: "Are you sure you want to delete Todo Name (<b>" + todo_name + "<b>) ?",
            title: "Confirmation required",
            confirm: function(button) {
                var WhereValueEquals = { rec_id: rec_id }

                var data = ls.DeleteArr(LocalstorageName, WhereValueEquals)


                $(".BTN_View").click();

            },
            cancel: function(button) {

            },
            confirmButton: "Yes I am",
            cancelButton: "No",
            confirmButtonClass: "btn-danger",
            cancelButtonClass: "btn-default",
            dialogClass: "modal-dialog modal-lg"
        }

        bs.confirm(ObjArrOptions);

    });

    $(document).on('click', '.BTN_Delete_All', function(event) {
        var AllTodos = _.sortBy(ls.GetAllArr(LocalstorageName), ['TodoDate']);

        if (js.Size(AllTodos) < 1 || js.Size(AllTodos) == 0) {
            var d = bs.AlertMsg("Oppps...Looks like there are no todos. <br><br> You should add a todo first", "warning");
            $('.Screen_Data').html(d).show();
            return false;
        }


        var ObjArrOptions = {
            text: "Are you sure you want to delete All Todos ?",
            title: "Confirmation required",
            confirm: function(button) {
                ls.Delete(LocalstorageName);
                $(".BTN_View").click();

            },
            cancel: function(button) {

            },
            confirmButton: "Yes I am",
            cancelButton: "No",
            confirmButtonClass: "btn-danger",
            cancelButtonClass: "btn-default",
            dialogClass: "modal-dialog modal-lg"
        }


        bs.confirm(ObjArrOptions);

    });


    var AllTodos = ls.GetAllArr(LocalstorageName);

    if (js.Size(AllTodos) > 0) {
        $(".BTN_View").click();
    }




});