package config

import (
	"strings"

	"github.com/spf13/viper"
)

type Config struct {
	Server       ServerConfig
	Log          LogConfig
	LogGenerator LogGeneratorConfig
	CORS         CORSConfig
}

type ServerConfig struct {
	Port string `mapstructure:"SERVER_PORT"`
}

type CORSConfig struct {
	AllowedOrigins []string `mapstructure:"CORS_ALLOWED_ORIGINS"`
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

	// Tenta ler o arquivo .env, mas não falha se não existir (útil para produção)
	// Em produção (Railway, etc), as variáveis vêm apenas das variáveis de ambiente
	_ = viper.ReadInConfig()

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	// Processa CORS_ALLOWED_ORIGINS se for uma string separada por vírgulas
	if corsOrigins := viper.GetString("CORS_ALLOWED_ORIGINS"); corsOrigins != "" {
		origins := strings.Split(corsOrigins, ",")
		// Remove espaços em branco de cada origem
		for i, origin := range origins {
			origins[i] = strings.TrimSpace(origin)
		}
		config.CORS.AllowedOrigins = origins
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
	// Default CORS origins (desenvolvimento local)
	if len(config.CORS.AllowedOrigins) == 0 {
		config.CORS.AllowedOrigins = []string{
			"http://localhost:5173",
			"http://localhost:3000",
			"http://127.0.0.1:5173",
			"http://127.0.0.1:3000",
		}
	}
}
