
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
const PAGE = {
  data: {
    filter: 'all',
    filters: {
      'all': 0,
      'active': 1,
      'completed': 2,
    },
    todos:[{
      title: '123',
      completed: true
    }]
  },
  init:function(){
    this.bind();
    this.render();
  },
  bind:function(){
    $('.new-todo').on('keyup', this.create);
    $('#toggle-all').on('click', this.toggleAll);
    $('.todoapp').on('click','.clear-completed', this.clear);
    $('.todoapp').on('click', '.filters li a', this.filter);
    $('.todo-list').on('click','.destroy',this.destroy);
    $('.todo-list').on('change','.toggle',this.toggleCompleted);
    $('.todo-list').on('dblclick','label',this.editingMode);
    $('.todo-list').on('focusout','.edit',this.update);
  },
  create:function(e){
    let $input = $(this);
    let val = $input.val().trim();
    if (e.which !== ENTER_KEY || !val) {
      return;
    }
    PAGE.data.todos.push({
      title:val,
      completed:false
    })
    $input.val('');
    PAGE.render();
  },
  filter:function(e){
    let filter = $(this).data('filter');
    PAGE.data.filter = filter;
    $('.filters li a').removeClass('selected');
    $(this).addClass('selected');
    PAGE.render();
  },
  clear:function(e){
    PAGE.data.todos = PAGE.data.todos.filter( data => data.completed == false);
    PAGE.render();
  },
  toggleAll:function(e){
    let isChecked = $(this).prop('checked');
    PAGE.data.todos.forEach( data => data.completed = !isChecked);
    PAGE.render();
  },
  destroy:function(){
    let index = $(this).parents('li').index();
    PAGE.data.todos.splice(index,1);
    PAGE.render();
  },
  toggleCompleted:function(){
    let index = $(this).parents('li').index();
    let isChecked = $(this).prop('checked');
    PAGE.data.todos[index].completed = !PAGE.data.todos[index].completed;
    PAGE.render();
  },
  editingMode:function(e){
    let $li = $(this).parents('li');
    let $input = $li.find('.edit');
    $li.addClass('editing');
    $input.focus();
  },
  update:function(e){
    let index = $(this).parents('li').index();
    let value = $(this).val().trim();
    if (!value) {
      PAGE.destroy.call(this);
    }else{
      PAGE.data.todos[index].title = value;
      PAGE.render();
    }
  },
  render:function(){
    let todosLen = PAGE.data.todos.length;
    let filter = PAGE.data.filter;
    let todos = PAGE.data.todos.filter( data => {
      if(filter === 'all'){
        return data
      }else if( filter === 'active'){
        return !data.completed
      }else if( filter === 'completed'){
        return data.completed
      }
    })

    // 设置List
    let html = todos.map( (data,index) => {
      return `
        <li data-index="${index}" class="${ data.completed ? 'completed' : '' }">
          <div class="view">
            <input class="toggle" type="checkbox" ${ data.completed ? 'checked' : '' }>
            <label>${data.title}</label>
            <button class="destroy"></button>
          </div>
          <input class="edit" value="${data.title}">
        </li>
      `
    }).join('');
    $('.todo-list').html(html);

    // 设置脚步和数量
    if(todosLen){
      $('.todo-count strong').text(todosLen);
      $('.todoapp .footer').show();
    }else{
      $('.todoapp .footer').hide();
    }
  }
}

PAGE.init();
  