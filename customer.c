#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Structure to store the date
struct date {
    int day;
    int month;
    int year;
};

// Structure to store customer account information
struct account {
    int account_number;
    char name[50];
    char address[100];
    char phone[15];
    char email[50];
    char account_type[20];
    float old_balance;
    float payment;
    float new_balance;
    float total_balance;
    struct date last_payment;
};

// Function prototypes
void input();
void output();
void search();
void update_record();
void delete_record();
void menu();
void header();

// Main function
int main() {
    menu();
    return 0;
}

// Header art
void header() {
    printf("\n***************************************************");
    printf("\n*           CUSTOMER BILLING SYSTEM               *");
    printf("\n***************************************************\n");
}

// Main menu
void menu() {
    int choice;

    while (1) {
        header();
        printf("1. 📝 Add Customer Record\n");
        printf("2. 📑 View All Records\n");
        printf("3. 🔍 Search Customer\n");
        printf("4. 🔄 Update Record\n");
        printf("5. 🗑️  Delete Record\n");
        printf("6. 🚪 Exit\n");
        printf("---------------------------------------------------\n");
        printf("Enter your choice (1-6): ");
        fflush(stdout);
        
        if (scanf("%d", &choice) != 1) {
            printf("\n❌ Invalid input. Please enter a number.\n");
            while (getchar() != '\n'); // Clear input buffer
            continue;
        }
        getchar(); // to consume newline

        switch (choice) {
            case 1: input(); break;
            case 2: output(); break;
            case 3: search(); break;
            case 4: update_record(); break;
            case 5: delete_record(); break;
            case 6:
                printf("\nExiting the system. Goodbye!\n");
                exit(0);
            default:
                printf("\n❌ Invalid choice. Try again.\n");
        }
    }
}

// Function to add customer record
void input() {
    FILE *fp = fopen("billing.txt", "ab"); // Use binary mode for consistent behavior
    if (fp == NULL) {
        printf("Error opening file!\n");
        return;
    }

    struct account customer;

    printf("\nEnter Account Number: ");
    fflush(stdout);
    if (scanf("%d", &customer.account_number) != 1) {
        printf("Invalid account number!\n");
        fclose(fp);
        return;
    }
    getchar();

    printf("Enter Name: ");
    fflush(stdout);
    if (fgets(customer.name, 50, stdin) == NULL) {
        printf("Error reading name!\n");
        fclose(fp);
        return;
    }
    customer.name[strcspn(customer.name, "\n")] = '\0';

    printf("Enter Address: ");
    fflush(stdout);
    if (fgets(customer.address, 100, stdin) == NULL) {
        printf("Error reading address!\n");
        fclose(fp);
        return;
    }
    customer.address[strcspn(customer.address, "\n")] = '\0';

    printf("Enter Phone: ");
    fflush(stdout);
    if (fgets(customer.phone, 15, stdin) == NULL) {
        printf("Error reading phone!\n");
        fclose(fp);
        return;
    }
    customer.phone[strcspn(customer.phone, "\n")] = '\0';

    printf("Enter Email: ");
    fflush(stdout);
    if (fgets(customer.email, 50, stdin) == NULL) {
        printf("Error reading email!\n");
        fclose(fp);
        return;
    }
    customer.email[strcspn(customer.email, "\n")] = '\0';

    printf("Enter Account Type (e.g., Savings, Current): ");
    fflush(stdout);
    if (fgets(customer.account_type, 20, stdin) == NULL) {
        printf("Error reading account type!\n");
        fclose(fp);
        return;
    }
    customer.account_type[strcspn(customer.account_type, "\n")] = '\0';

    printf("Enter Previous Balance: ");
    fflush(stdout);
    if (scanf("%f", &customer.old_balance) != 1) {
        printf("Invalid balance amount!\n");
        fclose(fp);
        return;
    }

    printf("Enter Payment Amount: ");
    fflush(stdout);
    if (scanf("%f", &customer.payment) != 1) {
        printf("Invalid payment amount!\n");
        fclose(fp);
        return;
    }

    customer.new_balance = customer.old_balance - customer.payment;
    customer.total_balance = customer.new_balance;

    printf("Enter Last Payment Date (DD MM YYYY): ");
    fflush(stdout);
    if (scanf("%d %d %d", &customer.last_payment.day, 
                         &customer.last_payment.month, 
                         &customer.last_payment.year) != 3) {
        printf("Invalid date format!\n");
        fclose(fp);
        return;
    }

    if (fwrite(&customer, sizeof(customer), 1, fp) != 1) {
        printf("Error writing to file!\n");
    } else {
        printf("\n✅ Customer record added successfully!\n");
    }

    fclose(fp);
}

// Function to display all records
void output() {
    FILE *fp = fopen("billing.txt", "rb"); // Use binary mode
    if (fp == NULL) {
        printf("No records found.\n");
        return;
    }

    printf("\n===== Customer Records =====\n");

    struct account customer;
    int records_found = 0;

    while (fread(&customer, sizeof(customer), 1, fp) == 1) {
        records_found = 1;
        printf("\nAccount No: %d\n", customer.account_number);
        printf("Name: %s\n", customer.name);
        printf("Address: %s\n", customer.address);
        printf("Phone: %s\n", customer.phone);
        printf("Email: %s\n", customer.email);
        printf("Account Type: %s\n", customer.account_type);
        printf("Old Balance: %.2f\n", customer.old_balance);
        printf("Payment: %.2f\n", customer.payment);
        printf("New Balance: %.2f\n", customer.new_balance);
        printf("Last Payment Date: %02d-%02d-%04d\n", 
               customer.last_payment.day, 
               customer.last_payment.month, 
               customer.last_payment.year);
        printf("-------------------------------------------\n");
    }

    if (!records_found) {
        printf("No customer records found.\n");
    }

    fclose(fp);
}

// Function to search for a customer by account number
void search() {
    int acc_no, found = 0;

    FILE *fp = fopen("billing.txt", "rb");
    if (fp == NULL) {
        printf("No records found.\n");
        return;
    }

    printf("Enter Account Number to search: ");
    if (scanf("%d", &acc_no) != 1) {
        printf("Invalid account number!\n");
        fclose(fp);
        return;
    }

    struct account customer;

    while (fread(&customer, sizeof(customer), 1, fp) == 1) {
        if (customer.account_number == acc_no) {
            found = 1;
            printf("\n✅ Record Found:\n");
            printf("Account No: %d\n", customer.account_number);
            printf("Name: %s\n", customer.name);
            printf("Address: %s\n", customer.address);
            printf("Phone: %s\n", customer.phone);
            printf("Email: %s\n", customer.email);
            printf("Account Type: %s\n", customer.account_type);
            printf("Old Balance: %.2f\n", customer.old_balance);
            printf("Payment: %.2f\n", customer.payment);
            printf("New Balance: %.2f\n", customer.new_balance);
            printf("Last Payment Date: %02d-%02d-%04d\n", 
                   customer.last_payment.day, 
                   customer.last_payment.month, 
                   customer.last_payment.year);
            break;
        }
    }

    if (!found) {
        printf("\n❌ Record not found.\n");
    }

    fclose(fp);
}

// Function to update a customer record
void update_record() {
    int acc_no, found = 0;
    FILE *fp = fopen("billing.txt", "rb+");
    if (fp == NULL) {
        printf("\n❌ No records found.\n");
        return;
    }

    printf("\nEnter Account Number to update: ");
    scanf("%d", &acc_no);
    getchar();

    struct account customer;
    long int size = sizeof(customer);

    while (fread(&customer, sizeof(customer), 1, fp) == 1) {
        if (customer.account_number == acc_no) {
            found = 1;
            printf("\n--- Current Details ---");
            printf("\nName: %s", customer.name);
            printf("\nAddress: %s", customer.address);
            printf("\nBalance: %.2f", customer.total_balance);

            printf("\n\n--- Enter New Details ---");
            printf("\nEnter New Name: ");
            fgets(customer.name, 50, stdin);
            customer.name[strcspn(customer.name, "\n")] = '\0';

            printf("Enter New Address: ");
            fgets(customer.address, 100, stdin);
            customer.address[strcspn(customer.address, "\n")] = '\0';

            printf("Enter New Previous Balance: ");
            scanf("%f", &customer.old_balance);
            printf("Enter Payment Amount: ");
    fflush(stdout);
            scanf("%f", &customer.payment);
            
            customer.new_balance = customer.old_balance - customer.payment;
            customer.total_balance = customer.new_balance;

            printf("Enter Last Payment Date (DD MM YYYY): ");
    fflush(stdout);
            scanf("%d %d %d", &customer.last_payment.day, 
                             &customer.last_payment.month, 
                             &customer.last_payment.year);

            fseek(fp, -size, SEEK_CUR);
            fwrite(&customer, sizeof(customer), 1, fp);
            printf("\n✅ Record updated successfully!\n");
            break;
        }
    }

    if (!found) printf("\n❌ Record not found.\n");
    fclose(fp);
}

// Function to delete a customer record
void delete_record() {
    int acc_no, found = 0;
    FILE *fp = fopen("billing.txt", "rb");
    FILE *ft = fopen("temp.txt", "wb");

    if (fp == NULL) {
        printf("\n❌ No records found.\n");
        if (ft) fclose(ft);
        return;
    }

    printf("\nEnter Account Number to delete: ");
    scanf("%d", &acc_no);
    getchar();

    struct account customer;

    while (fread(&customer, sizeof(customer), 1, fp) == 1) {
        if (customer.account_number == acc_no) {
            found = 1;
            printf("\n⚠️  Deleting Record for: %s", customer.name);
        } else {
            fwrite(&customer, sizeof(customer), 1, ft);
        }
    }

    fclose(fp);
    fclose(ft);

    if (found) {
        remove("billing.txt");
        rename("temp.txt", "billing.txt");
        printf("\n✅ Record deleted successfully!\n");
    } else {
        remove("temp.txt");
        printf("\n❌ Record not found.\n");
    }
}