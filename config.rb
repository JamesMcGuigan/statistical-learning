# Require any additional compass plugins here.


# Set this to the root of your project when deployed:
http_path       = "/app/public"
css_dir         = (environment == :production) ? "/production/css/" : "/app/public/scss/"
sass_dir        = "/app/public/scss-src/"
images_dir      = "/app/public/img"
javascripts_dir = "/app/public/js"

# You can select your preferred output style here (can be overridden via the command line): :expanded or :nested or :compact or :compressed
output_style = (environment == :production) ? :compressed : :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = (environment == :production) ? false : true


# https://github.com/postcss/autoprefixer
require 'autoprefixer-rails'
on_stylesheet_saved do |file|
  css = File.read(file)
  map = file + '.map'

  if File.exists? map
    result = AutoprefixerRails.process(css,
        from: file,
        to:   file,
        map:  { prev: map, inline: false })
    File.open(file, 'w') { |io| io << result.css }
    File.open(map,  'w') { |io| io << result.map }
  else
    File.open(file, 'w') { |io| io << AutoprefixerRails.process(css) }
  end
end