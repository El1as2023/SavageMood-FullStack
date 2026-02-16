package services

import (
	"fmt"
	"strconv"

	"github.com/savagemood/backend/internal/config"
	"gopkg.in/gomail.v2"
)

type EmailService struct {
	cfg *config.Config
}

func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{cfg: cfg}
}

func (s *EmailService) SendVerificationEmail(toEmail string, token string) error {
	port, _ := strconv.Atoi(s.cfg.SMTPPort)

	m := gomail.NewMessage()
	m.SetHeader("From", "SavageMood <no-reply@savagemood.com>")
	m.SetHeader("To", toEmail)
	m.SetHeader("Subject", "SavageMood: Verify your email")

	link := fmt.Sprintf("%s/verify?token=%s", s.cfg.FrontendURL, token)
	body := fmt.Sprintf(`<h1>Вітаємо в SavageMood!</h1>
		<p>Для завершення реєстрації підтвердіть вашу пошту:</p>
		<a href="%s">ПІДТВЕРДИТИ АКАУНТ</a>
														`, link)
	m.SetBody("text/html", body)
	d := gomail.NewDialer(s.cfg.SMTPHost, port, s.cfg.SMTPUser, s.cfg.SMTPPassword)
	return d.DialAndSend(m)
}
