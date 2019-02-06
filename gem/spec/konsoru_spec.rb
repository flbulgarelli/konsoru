require "spec_helper"

describe Konsoru do
  it { expect(File.exist? Konsoru.assets_path_for('javascripts/konsoru.js')).to be true }
end
