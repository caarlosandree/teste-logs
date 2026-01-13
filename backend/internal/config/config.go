package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	Server       ServerConfig
	Log          LogConfig
	LogGenerator LogGeneratorConfig
}

type ServerConfig struct {
	Port string `mapstructure:"SERVER_PORT"`
}

type LogConfig struct {
	Level    string `mapstructure:"LOG_LEVEL"`
	FilePath string `mapstructure:"LOG_FILE_PATH"`
}

type LogGeneratorConfig struct {
	RatePerSecond int `mapstructure:"LOG_RATE_PER_SECOND"`
}

func LoadConfig() (*Config, error) {
	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	setDefaults(&config)

	return &config, nil
}

func setDefaults(config *Config) {
	if config.Server.Port == "" {
		config.Server.Port = "8080"
	}
	if config.Log.Level == "" {
		config.Log.Level = "info"
	}
	if config.Log.FilePath == "" {
		config.Log.FilePath = "logs/app.log"
	}
	if config.LogGenerator.RatePerSecond == 0 {
		config.LogGenerator.RatePerSecond = 2000
	}
}
