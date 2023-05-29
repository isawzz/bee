async function load_config_new() {      Config 
	= await route_path_yaml_dict('../y/config.yaml');
  let data          = await route_path_yaml_dict(
		'../y/appdata.yaml');  for (const k in data) //das ist echt lustig!!!!!!!!!!
	{    Config.apps[k].data = data[k];
    }
}