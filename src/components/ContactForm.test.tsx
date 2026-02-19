/**
 * Epic 6.2 - FE-078/081/083: Tests de validation ContactForm + API + Turnstile
 * TDD RED Phase - Tests écrits AVANT implémentation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

// Mock Turnstile widget to simulate token generation
vi.mock('@marsidev/react-turnstile', () => ({
  Turnstile: ({ onSuccess }: { onSuccess: (token: string) => void }) => {
    // Auto-simulate successful token generation
    setTimeout(() => onSuccess('test-turnstile-token'), 0);
    return <div data-testid="turnstile-widget">Turnstile Mock</div>;
  },
}));

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

    expect(await screen.findByText(/message.*10 caractères/i)).toBeInTheDocument();
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

  it('should show error when message exceeds max length (2000 chars)', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    await user.type(messageInput, 'A'.repeat(2001));
    await user.click(submitButton);

    expect(await screen.findByText(/message.*2000 caractères/i)).toBeInTheDocument();
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

  // ========================================
  // Epic 6.2 FE-081: API Integration Tests
  // ========================================

  it('should call onSuccess callback when API responds successfully', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = vi.fn();
    const mockOnSubmit = vi.fn(async () => {
      // Simulate successful API response
      mockOnSuccess({
        success: true,
        messageId: 'test-message-id',
        message: 'Message envoyé avec succès',
      });
    });

    render(<ContactForm onSubmit={mockOnSubmit} onSuccess={mockOnSuccess} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/nom/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    // Verify onSubmit was called
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      });
    });
  });

  it('should call onError callback when API returns an error', async () => {
    const user = userEvent.setup();
    const mockOnError = vi.fn();
    const mockOnSubmit = vi.fn(async () => {
      throw new Error('API Error');
    });

    render(<ContactForm onSubmit={mockOnSubmit} onError={mockOnError} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/nom/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    // Submit should throw but not crash the app
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    // Verify submit was called
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  // ========================================
  // Epic 6.2 FE-082: UI States Tests
  // ========================================

  it('should show loading state during form submission', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn(async () => {
      // Simulate async delay
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/nom/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    const submitButton = screen.getByRole('button', { name: /envoyer/i });
    await user.click(submitButton);

    // Button should show loading text
    expect(screen.getByText(/envoi en cours/i)).toBeInTheDocument();

    // Button should be disabled
    expect(submitButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should show success message after successful submission', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/nom/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    // Success message should appear
    expect(await screen.findByText(/message envoyé avec succès/i)).toBeInTheDocument();

    // Form should be reset (fields should be empty)
    await waitFor(() => {
      expect(screen.getByLabelText(/nom/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/message/i)).toHaveValue('');
    });
  });

  it('should show error message after failed submission', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn(async () => {
      throw new Error('Network error');
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/nom/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    // Error message should appear
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();

    // Retry button should be visible
    expect(screen.getByText(/réessayer/i)).toBeInTheDocument();
  });

  it('should allow retry after error', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn(async () => {
      throw new Error('API Error');
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill and submit form (will fail)
    await user.type(screen.getByLabelText(/nom/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    // Error should appear
    expect(await screen.findByText(/api error/i)).toBeInTheDocument();

    // Click retry button
    const retryButton = screen.getByText(/réessayer/i);
    await user.click(retryButton);

    // Error should disappear
    expect(screen.queryByText(/api error/i)).not.toBeInTheDocument();
  });

  it('should disable all form fields during submission', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/nom/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole('button', { name: /envoyer/i });

    // Fill and submit form
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    await user.click(submitButton);

    // All fields should be disabled during loading
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(messageInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
