package tn.esprit.spring.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import tn.esprit.spring.entities.Subscription;
import tn.esprit.spring.entities.TypeSubscription;
import tn.esprit.spring.repositories.ISubscriptionRepository;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static tn.esprit.spring.entities.TypeSubscription.ANNUAL;

@ExtendWith(SpringExtension.class)
class SubscriptionServicesImplTest {

    @Mock
    private ISubscriptionRepository subscriptionRepository; // Mock the repository

    @InjectMocks
    private SubscriptionServicesImpl subscriptionServiceImpl; // Inject the service

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks
    }

    @Test
    void testAddSubscription() {
        // Test data
        Subscription addSubscription = Subscription.builder()
                .startDate(LocalDate.parse("2024-10-10"))
                .endDate(LocalDate.parse("2024-11-11"))
                .typeSub(ANNUAL)
                .price(1.11f)
                .build();

        Subscription savedSubscription = Subscription.builder()
                .numSub(1L)
                .startDate(LocalDate.parse("2024-10-10"))
                .endDate(LocalDate.parse("2024-11-11"))
                .typeSub(ANNUAL)
                .price(1.11f)
                .build();

        // Mocking repository behavior
        when(subscriptionRepository.save(addSubscription)).thenReturn(savedSubscription);

        // Method call
        Subscription result = subscriptionServiceImpl.addSubscription(addSubscription);

        // Verifications
        assertNotNull(result.getNumSub());
        assertEquals(1L, result.getNumSub());
    }

    @Test
    void testUpdateSubscription() {
        Subscription savedSubscription = Subscription.builder()
                .numSub(1L)
                .startDate(LocalDate.parse("2024-10-10"))
                .endDate(LocalDate.parse("2024-11-11"))
                .typeSub(ANNUAL)
                .price(1.11f)
                .build();

        when(subscriptionRepository.save(savedSubscription)).thenReturn(savedSubscription);

        savedSubscription.setPrice(22.3f);

        Subscription updatedSubscription = subscriptionServiceImpl.updateSubscription(savedSubscription);

        assertNotNull(updatedSubscription.getNumSub());
        assertEquals(22.3f, updatedSubscription.getPrice());
    }

    @Test
    void testRetrieveSubscriptionById() {
        Long subscriptionId = 1L;

        Subscription retrievedSubscription = Subscription.builder()
                .numSub(subscriptionId)
                .startDate(LocalDate.parse("2024-10-10"))
                .endDate(LocalDate.parse("2024-11-11"))
                .typeSub(ANNUAL)
                .price(1.11f)
                .build();

        when(subscriptionRepository.findById(subscriptionId)).thenReturn(Optional.of(retrievedSubscription));

        Subscription result = subscriptionServiceImpl.retrieveSubscriptionById(subscriptionId);

        assertNotNull(result);
        assertEquals(subscriptionId, result.getNumSub());
    }

    @Test
    void testGetSubscriptionByType() {
        TypeSubscription subscriptionType = ANNUAL;

        Set<Subscription> subscriptions = new HashSet<>();
        subscriptions.add(Subscription.builder()
                .numSub(1L)
                .startDate(LocalDate.parse("2024-10-10"))
                .endDate(LocalDate.parse("2024-11-11"))
                .typeSub(subscriptionType)
                .price(1.11f)
                .build());

        when(subscriptionRepository.findByTypeSubOrderByStartDateAsc(subscriptionType)).thenReturn(subscriptions);

        Set<Subscription> result = subscriptionServiceImpl.getSubscriptionByType(subscriptionType);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        for (Subscription subscription : result) {
            assertEquals(subscriptionType, subscription.getTypeSub());
        }
    }
}