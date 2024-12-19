import { ContainerComponent } from './container.component';

describe('ContainerComponent', () => {
  let component: ContainerComponent;

  beforeEach(() => {
    component = new ContainerComponent();
  });

  it('should initialize with correct initial values', () => {
    expect(component.isHalfShown).toBeFalse();
    expect(component.toggle).toBeFalse();
  });

  it('should emit correct data when getValue is called', () => {
    let emittedValue: boolean | undefined;
    component.dataEvent.subscribe((data: boolean) => {
      emittedValue = data;
    });

    component.getValue();

    expect(emittedValue).toBeFalse();
  });

  it('should correctly update isHalfShown and toggle when receiveData is called', () => {
    component.receiveData(true);

    expect(component.isHalfShown).toBeTrue();
    expect(component.toggle).toBeTrue();

    component.receiveData(false);

    expect(component.isHalfShown).toBeFalse();
    expect(component.toggle).toBeFalse();
  });

});
