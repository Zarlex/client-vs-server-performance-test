function render(tmpl_name, tmpl_data) {
  if ( !render.tmpl_cache ) {
    render.tmpl_cache = {};
  }

  if ( ! render.tmpl_cache[tmpl_name] ) {
    var tmpl_url = tmpl_name + '.html';
    var tmpl_string;

    $.ajax({
      url: tmpl_url,
      method: 'GET',
      async: false,
      success: function(data) {
        tmpl_string = data;
      }
    });

    render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
  }

  return render.tmpl_cache[tmpl_name](tmpl_data);
}