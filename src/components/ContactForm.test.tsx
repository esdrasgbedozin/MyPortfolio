/**
 * Epic 6.2 - FE-078: Tests de validation ContactForm
 * TDD RED Phase - Tests écrits AVANT implémentation
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

describe('ContactForm - Epic 6.2 FE-078', () => {
  it('should render form with name, email and message fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
  });

  it('should show required error when name is empty', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    await user.click(submitButton);

    expect(await screen.findByText(/nom est requis/i, {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it('should show required error when email is empty', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    await user.click(submitButton);

    expect(await screen.findByText(/email est requis/i)).toBeInTheDocument();
  });

  it('should show invalid email format error', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nom/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'invalid-email');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText(/l'email est invalide/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should show required error when message is empty', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    await user.click(submitButton);

    expect(await screen.findByText(/message est requis/i)).toBeInTheDocument();
  });

  it('should show error when name exceeds max length (100 chars)', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nom/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(nameInput, 'A'.repeat(101));
    await user.click(submitButton);

    expect(await screen.findByText(/nom.*100 caractères/i)).toBeInTheDocument();
  });

  it('should show error when message exceeds max length (1000 chars)', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(messageInput, 'A'.repeat(1001));
    await user.click(submitButton);

    expect(await screen.findByText(/message.*1000 caractères/i)).toBeInTheDocument();
  });

  it('should accept valid form data', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/nom/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Hello, this is a test message');
    await user.click(submitButton);

    // No validation errors should be displayed
    expect(screen.queryByText(/requis/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/invalide/i)).not.toBeInTheDocument();
  });

  it('should clear errors when user corrects input', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    // Submit with invalid email
    await user.type(emailInput, 'invalid');
    await user.click(submitButton);
    expect(await screen.findByText(/l'email est invalide/i)).toBeInTheDocument();

    // Correct the email and submit again
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');
    await user.type(screen.getByLabelText(/nom/i), 'Test');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(submitButton);

    // Error should disappear
    expect(screen.queryByText(/email invalide/i)).not.toBeInTheDocument();
  });
});
